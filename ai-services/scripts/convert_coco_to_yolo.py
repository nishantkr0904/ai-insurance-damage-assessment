import json
import os
from pathlib import Path
from PIL import Image

# ===== PATHS =====
COCO_JSON = "../datasets/damage/raw/car-damage-coco-dataset/train/annotations.json"
IMAGES_DIR = "../datasets/damage/raw/car-damage-coco-dataset/train"
OUTPUT_IMAGES = "../datasets/damage/processed/images/train"
OUTPUT_LABELS = "../datasets/damage/processed/labels/train"

# Create folders
os.makedirs(OUTPUT_IMAGES, exist_ok=True)
os.makedirs(OUTPUT_LABELS, exist_ok=True)

# Load COCO
with open(COCO_JSON) as f:
    coco = json.load(f)

images = {img["id"]: img for img in coco["images"]}

# Group annotations by image
annotations_per_image = {}
for ann in coco["annotations"]:
    annotations_per_image.setdefault(ann["image_id"], []).append(ann)

# Convert
for image_id, img in images.items():
    file_name = img["file_name"]
    width = img["width"]
    height = img["height"]

    src_path = os.path.join(IMAGES_DIR, file_name)
    dst_path = os.path.join(OUTPUT_IMAGES, file_name)

    if not os.path.exists(src_path):
        continue

    # Copy image
    os.system(f"cp '{src_path}' '{dst_path}'")

    label_path = os.path.join(OUTPUT_LABELS, file_name.replace(".jpg", ".txt"))

    with open(label_path, "w") as f:
        for ann in annotations_per_image.get(image_id, []):
            x, y, w, h = ann["bbox"]

            # Convert to YOLO format
            x_center = (x + w / 2) / width
            y_center = (y + h / 2) / height
            w /= width
            h /= height

            class_id = 0  # only one class

            f.write(f"{class_id} {x_center} {y_center} {w} {h}\n")

print("✅ Conversion completed!")