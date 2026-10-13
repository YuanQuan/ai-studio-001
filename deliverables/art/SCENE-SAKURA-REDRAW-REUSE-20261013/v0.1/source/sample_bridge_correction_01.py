# -*- coding: utf-8 -*-
"""Run the same deterministic sample pipeline for corrected bridge candidate 2."""
from pathlib import Path

import sample_bridge as sample


sample.NATIVE = sample.BASE / "source/native/bridge_correction_01_native.png"
sample.SOURCE = sample.BASE / "source/bridge_correction_01_full_work.png"
sample.HALF = sample.BASE / "exports/tex_sakura_rr_bridge_correction_01_half.png"
sample.REVIEW = sample.BASE / "review/bridge_correction_01"
sample.MANIFEST = sample.BASE / "SAMPLE_CORRECTION_01_SOURCE_MANIFEST.json"
sample.SCALE = 0.45
sample.CORE_X = 1047
sample.CORE_Y = 535
sample.main()
