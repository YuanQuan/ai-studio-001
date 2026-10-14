// Generated from approved Art v0.2 manifest; source remains in deliverables/art.
export const SAKURA_CUT_MANIFEST = {
  "task_id": "SCENE-SAKURA-LAYERED-ASSET-20261011",
  "version": "v0.2",
  "canvas": {
    "width": 3072,
    "height": 1024
  },
  "reference": "reference/user_selected_sakura.png",
  "method": "内置imagegen生成各语义真层，按已批准方案确定性裁切/缩放/透明布局；L03H和L04H正式只导左半，右半镜像；原六店另以独立可关闭参考层合成",
  "cuts": [
    {
      "id": "SAK-L01",
      "description": "夜空、月与云",
      "export": {
        "path": "exports/tex_sakura_l01_sky.png",
        "width": 3072,
        "height": 1024,
        "pixels": 3145728,
        "bytes": 2810611,
        "sha256": "96dca8e8d24d07759c28dc092bff84b81192a20ff823614b38f960b8e109fc9e"
      },
      "native_sources": [
        {
          "path": "source/l01_sky_native.png",
          "width": 2172,
          "height": 724,
          "pixels": 1572528,
          "bytes": 1893553,
          "sha256": "c046e24bebc2b066acf097c9755025ea5a3873883ea4c1bd21e6b354a738d81e"
        }
      ],
      "transform": "2172×724 原生图插值规范到3072×1024；不增加原生细节",
      "alpha": false,
      "instance_count": 1
    },
    {
      "id": "SAK-L02",
      "description": "高山幽都与薄雾",
      "export": {
        "path": "exports/tex_sakura_l02_distance.png",
        "width": 3072,
        "height": 700,
        "pixels": 2150400,
        "bytes": 2383823,
        "sha256": "35ee6573a55bb082322bf07e1d34faaa42639bec6a02dab83b2168843595cab7"
      },
      "native_sources": [
        {
          "path": "source/l02_mountains_native.png",
          "width": 2172,
          "height": 724,
          "pixels": 1572528,
          "bytes": 1717479,
          "sha256": "b7c7316931daa842bc4068e4283ed22bd22ef75c4d7a517af7b5c07504eb4365"
        }
      ],
      "transform": "原生图规范尺寸、透明裁底至700高",
      "alpha": true,
      "instance_count": 1
    },
    {
      "id": "SAK-L03H",
      "description": "左半宽街与单圆拱桥",
      "export": {
        "path": "exports/tex_sakura_l03_street_bridge_half.png",
        "width": 1536,
        "height": 512,
        "pixels": 786432,
        "bytes": 1960792,
        "sha256": "e0c238bfa75f0084b8e3811aa301ef6738ecc98e6e171663937e02cc30734d1b"
      },
      "native_sources": [
        {
          "path": "source/l03_street_bridge_sample_v7_native.png",
          "width": 2172,
          "height": 724,
          "pixels": 1572528,
          "bytes": 711173,
          "sha256": "1fc245b6e140e24fbf78406f28293bcb1579741f758b07f3b8328f2ffc5ae86f"
        },
        {
          "path": "source/l03_street_only_native.png",
          "width": 2172,
          "height": 724,
          "pixels": 1572528,
          "bytes": 627387,
          "sha256": "2f5779790d4e8a76ac75c6b7c51c034a96bfbe49f6440cce33f20fb035de69ae"
        },
        {
          "path": "source/l03_bridge_only_native.png",
          "width": 2172,
          "height": 724,
          "pixels": 1572528,
          "bytes": 615407,
          "sha256": "2ba2c9f59438e070d0cf0bbbc250524e2679d17d078224ea1c420654fc570c2a"
        }
      ],
      "transform": "v7语义基础上定向分离无桥街道和独立桥；桥裁缩到510×265置全幅x1281,y590；街道复合后仅导左半1536×512，右半镜像。v8候选未采用",
      "alpha": true,
      "instance_count": 2
    },
    {
      "id": "SAK-L04H",
      "description": "左半前河、水道与栏杆",
      "export": {
        "path": "exports/tex_sakura_l04_water_rail_half.png",
        "width": 1536,
        "height": 360,
        "pixels": 552960,
        "bytes": 684071,
        "sha256": "c4ee77156a238cec8f2a28ff00114ea74ddd394b867d8debdc37c938c737810f"
      },
      "native_sources": [
        {
          "path": "source/l04_water_native.png",
          "width": 2172,
          "height": 724,
          "pixels": 1572528,
          "bytes": 482947,
          "sha256": "959745f68585c1062503dcb7e54ebec5c336e3668a62ced21deafedfe1b7c583"
        },
        {
          "path": "source/l04_rail_native.png",
          "width": 2172,
          "height": 724,
          "pixels": 1572528,
          "bytes": 579612,
          "sha256": "fe1f162527b586170764a3dfa7f209badb98c78466de4ec0dbd8237f4247c376"
        }
      ],
      "transform": "水与栏分层裁切缩放；水自y849、栏顶约y750，桥洞中央追加同源远水并依桥洞遮罩；仅导左半1536×360，右半镜像",
      "alpha": true,
      "instance_count": 2
    },
    {
      "id": "SAK-L05",
      "description": "近景草石",
      "export": {
        "path": "exports/tex_sakura_l05_grass.png",
        "width": 700,
        "height": 232,
        "pixels": 162400,
        "bytes": 179264,
        "sha256": "3b22b47295bccf95e3cf4db4b8b22354a4fa7cf56af5c69d9fa7023e0246c9f4"
      },
      "native_sources": [
        {
          "path": "deliverables/art/SCENE-SAKURA-LAYERED-ASSET-20261011/v0.1/exports/tex_sakura_l05_grass.png",
          "width": 700,
          "height": 232,
          "pixels": 162400,
          "bytes": 179264,
          "sha256": "3b22b47295bccf95e3cf4db4b8b22354a4fa7cf56af5c69d9fa7023e0246c9f4"
        }
      ],
      "transform": "v0.1同一PNG像素原样复用；两侧实例水平镜像",
      "alpha": true,
      "instance_count": 2
    },
    {
      "id": "SAK-TREE-A",
      "description": "蓬松粉紫樱树A",
      "export": {
        "path": "exports/tex_sakura_tree_a.png",
        "width": 405,
        "height": 420,
        "pixels": 170100,
        "bytes": 219576,
        "sha256": "63b172211f1ef1710331179d42b006956c596af5893367f89600f2419a0cc1d4"
      },
      "native_sources": [
        {
          "path": "source/tree_a_native.png",
          "width": 1222,
          "height": 1287,
          "pixels": 1572714,
          "bytes": 1753569,
          "sha256": "7305abe07a825ed02060a4ab697d1d242d9fe26397ef9397d47330bbf2a094fe"
        }
      ],
      "transform": "真透明去空边，缩小到405×420",
      "alpha": true,
      "instance_count": 3
    },
    {
      "id": "SAK-TREE-B",
      "description": "柔枝高冠樱树B",
      "export": {
        "path": "exports/tex_sakura_tree_b.png",
        "width": 279,
        "height": 420,
        "pixels": 117180,
        "bytes": 176545,
        "sha256": "cbab31f9835a4e51938e3a779e78c9617571ff66be6691f7d4dc95bb5b8dfe07"
      },
      "native_sources": [
        {
          "path": "source/tree_b_native.png",
          "width": 1024,
          "height": 1536,
          "pixels": 1572864,
          "bytes": 2328420,
          "sha256": "6ddeb263f722d9fe96f8758b37609f765b254a72483a6c8f38b1f881c1f0112f"
        }
      ],
      "transform": "真透明去空边，缩小到279×420",
      "alpha": true,
      "instance_count": 3
    },
    {
      "id": "SAK-GHOST",
      "description": "蓝白两眼小火灵",
      "export": {
        "path": "exports/tex_sakura_ghost_a.png",
        "width": 80,
        "height": 88,
        "pixels": 7040,
        "bytes": 3685,
        "sha256": "35563f2f5e12523d94213968fa48eba5c362cf24c9533c02b8d8123b4e3fe992"
      },
      "native_sources": [
        {
          "path": "source/ghost_eyes_native.png",
          "width": 1374,
          "height": 1145,
          "pixels": 1573230,
          "bytes": 197412,
          "sha256": "9ce006be36f932ecdd39a011dca6813629d493c1a78732c3a5574c11d943dca2"
        }
      ],
      "transform": "真透明去空边，缩小到80×88",
      "alpha": true,
      "instance_count": 4
    },
    {
      "id": "SAK-BOAT",
      "description": "方纸灯莲船与同层柔波倒影",
      "export": {
        "path": "exports/tex_sakura_boat_reflection_a.png",
        "width": 115,
        "height": 117,
        "pixels": 13455,
        "bytes": 13556,
        "sha256": "5f5528ddced64b875582f656ec466912929ed66b21cac11481ff15c297890769"
      },
      "native_sources": [
        {
          "path": "source/boat_native.png",
          "width": 1240,
          "height": 1269,
          "pixels": 1573560,
          "bytes": 864689,
          "sha256": "fa72e2d54d88a36a94f623e64fc4823e80d7ef18ea8de9fe5b4a4c83ee51afee"
        }
      ],
      "transform": "灯船与自身倒影合为一组透明原型，缩小到115×117",
      "alpha": true,
      "instance_count": 5
    },
    {
      "id": "SAK-GATE",
      "description": "右侧唯一朴素瓦檐牌楼",
      "export": {
        "path": "exports/tex_sakura_gate.png",
        "width": 314,
        "height": 380,
        "pixels": 119320,
        "bytes": 135082,
        "sha256": "7a48213448cab29a315101c289fa4ec60ad645079279c9408f984bf5df203955"
      },
      "native_sources": [
        {
          "path": "source/gate_native.png",
          "width": 1141,
          "height": 1379,
          "pixels": 1573439,
          "bytes": 1366124,
          "sha256": "bf79509a08e7e591c1d7f4ca57a9e6cb5e2e3f3128cede0ee740cbcd6e3fbea4"
        }
      ],
      "transform": "真透明去空边，缩小到314×380；不镜像",
      "alpha": true,
      "instance_count": 1
    }
  ],
  "totals": {
    "prototype_count": 10,
    "environment_instance_count": 24,
    "prototype_pixels": 7225015,
    "prototype_png_bytes": 8567005,
    "half_pair_saved_pixels": 1339392,
    "psd_bytes": 44253546,
    "psd_layers": 30
  },
  "review": {
    "scene": "review/scene_with_original_shops.png",
    "reference_comparison": "review/reference_comparison.png",
    "resource_sheet": "review/resource_sheet.png",
    "psd": "source/scene_sakura_master.psd",
    "psd_preview": "review/scene_psd_preview.png"
  }
};
