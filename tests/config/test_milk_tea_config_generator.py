import importlib.util
import json
import shutil
import tempfile
import unittest
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
MODULE_PATH = ROOT / "tooling/config/milk_tea_config_generator.py"
spec = importlib.util.spec_from_file_location("milk_tea_config_generator", MODULE_PATH)
generator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(generator)


class MilkTeaConfigGeneratorTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.base = Path(self.temp.name)
        self.source = ROOT / "project/config/source/MILK_TEA_MINIGAME.xlsx"
        self.approval = ROOT / "tasks/MILK-TEA-MINIGAME-CONFIG-PROMOTION-20261012/ARTIFACT_APPROVAL_v0.1.json"

    def tearDown(self):
        self.temp.cleanup()

    def test_full_projection_is_deterministic_and_minimal(self):
        temp_root, source, approval = self._temporary_bound_candidate(mutation=None)
        server, client = generator.build_config(temp_root, source, approval)
        self.assertEqual([len(server[k]) for k in ("difficulty_stages", "unlock_conditions", "ingredients", "recipes")], [10, 5, 20, 15])
        self.assertEqual(server["source_sha256"], client["source_sha256"])
        self.assertEqual(server["config_version"], client["config_version"])
        self.assertEqual([t["recipe_dims"] for t in client["tiers"]], [3, 4, 5, 5, 5])
        self.assertNotIn("unlock_conditions", client)
        self.assertNotIn("xp_reward", json.dumps(client))
        easy = client["tiers"][0]
        self.assertEqual(len(easy["stages"][0]["ingredient_choices"]["TEA"]), 2)
        self.assertEqual(len(easy["stages"][1]["ingredient_choices"]["TEA"]), 3)
        self.assertEqual([hint["min_stage_no"] for hint in easy["recipe_hints"]], [1, 1, 2])
        samples = temp_root / "deliverables/tech_lead/MILK-TEA-MINIGAME-CONFIG-GENERATOR-20261012/v0.2/samples"
        first, second = samples / "a", samples / "b"
        hashes_a = generator.generate(source, approval, first, root=temp_root)
        before = {path.name: path.read_bytes() for path in first.iterdir()}
        hashes_repeat = generator.generate(source, approval, first, root=temp_root)
        self.assertEqual(hashes_a, hashes_repeat)
        self.assertEqual(before, {path.name: path.read_bytes() for path in first.iterdir()})
        hashes_b = generator.generate(source, approval, second, root=temp_root)
        self.assertEqual(hashes_a, hashes_b)
        self.assertEqual((first / "milk_tea_minigame.server.json").read_bytes(), (second / "milk_tea_minigame.server.json").read_bytes())
        self.assertEqual((first / "milk_tea_minigame.client.json").read_bytes(), (second / "milk_tea_minigame.client.json").read_bytes())

    def test_protected_output_destination_is_rejected(self):
        temp_root, source, approval = self._temporary_bound_candidate(mutation=None)
        with self.assertRaisesRegex(generator.ConfigError, "samples"):
            generator.generate(source, approval, temp_root, root=temp_root)

    def _temporary_bound_candidate(self, mutation="nonready"):
        temp_root = self.base / "repo"
        (temp_root / "project/config/source").mkdir(parents=True)
        (temp_root / "tasks/MILK-TEA-MINIGAME-CONFIG-PROMOTION-20261012").mkdir(parents=True)
        shutil.copy2(self.source, temp_root / "project/config/source/MILK_TEA_MINIGAME.xlsx")
        workbook_path = temp_root / "project/config/source/MILK_TEA_MINIGAME.xlsx"
        altered = self.base / "altered.xlsx"
        with zipfile.ZipFile(workbook_path) as source_zip, zipfile.ZipFile(altered, "w", zipfile.ZIP_DEFLATED) as out_zip:
            for info in source_zip.infolist():
                data = source_zip.read(info.filename)
                if mutation == "nonready" and info.filename == "xl/worksheets/sheet1.xml":
                    data = data.replace(b">READY<", b">DRAFT<", 1)
                if mutation == "bad_reference" and info.filename == "xl/worksheets/sheet4.xml":
                    data = data.replace(b"TEA_BLACK", b"TEA_MISSING", 1)
                out_zip.writestr(info, data)
        shutil.move(altered, workbook_path)
        digest = generator.sha256(workbook_path)
        approval = json.loads(self.approval.read_text(encoding="utf-8"))
        approval["decision_note"] = f"project/config/source/MILK_TEA_MINIGAME.xlsx={digest}"
        approval_path = temp_root / "tasks/MILK-TEA-MINIGAME-CONFIG-PROMOTION-20261012/ARTIFACT_APPROVAL_v0.1.json"
        approval_path.write_text(json.dumps(approval), encoding="utf-8")
        index = {"current_formal_resources": [], "resources": [{"id": "MILK_TEA_MINIGAME", "candidate_path": "project/config/source/MILK_TEA_MINIGAME.xlsx", "candidate_sha256": digest, "approval_ref": "tasks/MILK-TEA-MINIGAME-CONFIG-PROMOTION-20261012/ARTIFACT_APPROVAL_v0.1.json", "active_path": None}]}
        (temp_root / "project/config/RESOURCE_INDEX.json").write_text(json.dumps(index), encoding="utf-8")
        return temp_root, workbook_path, approval_path

    def test_any_nonready_row_fails_without_replacing_existing_output(self):
        temp_root, source, approval = self._temporary_bound_candidate()
        output = temp_root / "deliverables/tech_lead/MILK-TEA-MINIGAME-CONFIG-GENERATOR-20261012/v0.2/samples/candidate"
        output.mkdir(parents=True)
        sentinel = output / "keep.txt"
        sentinel.write_text("previous output", encoding="utf-8")
        with self.assertRaisesRegex(generator.ConfigError, "READY"):
            generator.generate(source, approval, output, root=temp_root)
        self.assertEqual(sentinel.read_text(encoding="utf-8"), "previous output")
        self.assertEqual(sorted(p.name for p in output.iterdir()), ["keep.txt"])

    def test_dangling_cross_table_reference_fails(self):
        temp_root, source, approval = self._temporary_bound_candidate("bad_reference")
        with self.assertRaisesRegex(generator.ConfigError, "错误维度原料"):
            generator.build_config(temp_root, source, approval)

    def test_existing_unmarked_or_changed_output_is_never_overwritten(self):
        temp_root, source, approval = self._temporary_bound_candidate(mutation=None)
        output = temp_root / "deliverables/tech_lead/MILK-TEA-MINIGAME-CONFIG-GENERATOR-20261012/v0.2/samples/candidate"
        output.mkdir(parents=True)
        sentinel = output / "keep.txt"
        sentinel.write_text("user data", encoding="utf-8")
        with self.assertRaisesRegex(generator.ConfigError, "不同或包含额外文件"):
            generator.generate(source, approval, output, root=temp_root)
        self.assertEqual(sentinel.read_text(encoding="utf-8"), "user data")
        self.assertEqual(sorted(path.name for path in output.iterdir()), ["keep.txt"])


if __name__ == "__main__":
    unittest.main()
