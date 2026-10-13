from pathlib import Path
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1]
for name in ("reference/user_reference_3072x1024.png", "review/scene_environment.png"):
    a = np.asarray(Image.open(root / name).convert("RGB"))
    yy, xx = np.indices(a.shape[:2])
    mask = ((xx >= 1850) & (xx <= 2250) & (yy >= 20) & (yy <= 350)
            & (a[:, :, 0] >= 220) & (a[:, :, 1] >= 105)
            & (a[:, :, 2] >= 125) & (a[:, :, 0] > a[:, :, 2] + 15))
    row = np.count_nonzero(mask, axis=1)
    col = np.count_nonzero(mask, axis=0)
    rows = np.flatnonzero(row >= 80)
    cols = np.flatnonzero(col >= 80)
    print(name, "dense-pink-row", (int(rows.min()), int(rows.max())),
          "dense-pink-col", (int(cols.min()), int(cols.max())),
          "centroid", (float(np.mean(xx[mask])), float(np.mean(yy[mask]))))
