import os
import cv2
import numpy as np

def load_image(file_path: str) -> np.ndarray:
    """
    Load an image from the filesystem.

    Args:
        file_path (str): Absolute or relative path to the image file.

    Returns:
        np.ndarray: Loaded image as a numpy array.

    Raises:
        FileNotFoundError: If the file does not exist.
        ValueError: If the file exists but cannot be loaded/decoded as an image.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found at: {file_path}")
    
    img = cv2.imread(file_path)
    if img is None:
        raise ValueError(f"File at {file_path} is not a valid image or is corrupted.")
    
    return img

def convert_to_rgb(img: np.ndarray) -> np.ndarray:
    """
    Convert a BGR image to RGB format.

    Args:
        img (np.ndarray): Input image.

    Returns:
        np.ndarray: RGB image.
    """
    if len(img.shape) == 3 and img.shape[2] == 3:
        return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img

def preprocess_image(file_path: str) -> np.ndarray:
    """
    Load and preprocess the image to optimize readability for the OCR engine.

    Args:
        file_path (str): Path to the image file.

    Returns:
        np.ndarray: Preprocessed image in RGB format.

    Raises:
        FileNotFoundError: If the file does not exist.
        ValueError: If the file is not a valid image or cannot be decoded.
    """
    img = load_image(file_path)
    img_rgb = convert_to_rgb(img)
    return img_rgb
