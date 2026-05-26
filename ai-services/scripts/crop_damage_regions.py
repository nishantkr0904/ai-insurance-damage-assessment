from pathlib import Path

try:
    import cv2
except ModuleNotFoundError as exc:
    raise SystemExit(
        "OpenCV (cv2) is not available in the active interpreter. "
        "Use the project venv, for example:\n"
        "  cd ai-insurance-damage-assessment\n"
        "  source .venv/bin/activate\n"
        "  python ai-services/scripts/crop_damage_regions.py"
    ) from exc


SCRIPT_DIR = Path(__file__).resolve().parent
IMAGE_DIR = SCRIPT_DIR.parent / "datasets" / "damage" / "processed" / "images" / "train"
LABEL_DIR = SCRIPT_DIR.parent / "datasets" / "damage" / "processed" / "labels" / "train"
OUTPUT_DIR = SCRIPT_DIR.parent / "datasets" / "severity" / "raw_crops"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def yolo_to_bbox(img, x, y, w, h):
    height, width, _ = img.shape
    x1 = int((x - w / 2) * width)
    y1 = int((y - h / 2) * height)
    x2 = int((x + w / 2) * width)
    y2 = int((y + h / 2) * height)

    # Clamp coordinates to image boundaries to avoid invalid slicing.
    x1 = max(0, min(x1, width - 1))
    y1 = max(0, min(y1, height - 1))
    x2 = max(0, min(x2, width))
    y2 = max(0, min(y2, height))

    return x1, y1, x2, y2


def main():
    if not IMAGE_DIR.is_dir():
        raise SystemExit(f"Image directory not found: {IMAGE_DIR}")
    if not LABEL_DIR.is_dir():
        raise SystemExit(f"Label directory not found: {LABEL_DIR}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    images_seen = 0
    images_processed = 0
    crops_written = 0
    malformed_labels = 0

    for image_path in sorted(IMAGE_DIR.iterdir()):
        if image_path.suffix.lower() not in ALLOWED_EXTENSIONS:
            continue

        images_seen += 1
        label_path = LABEL_DIR / f"{image_path.stem}.txt"
        if not label_path.exists():
            continue

        img = cv2.imread(str(image_path))
        if img is None:
            continue

        images_processed += 1
        lines = label_path.read_text(encoding="utf-8").splitlines()
        for i, line in enumerate(lines):
            if not line.strip():
                continue

            parts = line.strip().split()
            if len(parts) != 5:
                malformed_labels += 1
                continue

            try:
                _, x, y, w, h = map(float, parts)
            except ValueError:
                malformed_labels += 1
                continue

            x1, y1, x2, y2 = yolo_to_bbox(img, x, y, w, h)
            if x2 <= x1 or y2 <= y1:
                continue

            crop = img[y1:y2, x1:x2]
            if crop.size == 0:
                continue

            out_name = f"{image_path.stem}_{i}.jpg"
            ok = cv2.imwrite(str(OUTPUT_DIR / out_name), crop)
            if ok:
                crops_written += 1

    print(
        "Cropping completed. "
        f"images_seen={images_seen}, "
        f"images_processed={images_processed}, "
        f"crops_written={crops_written}, "
        f"malformed_labels={malformed_labels}, "
        f"output_dir={OUTPUT_DIR}"
    )


if __name__ == "__main__":
    main()
