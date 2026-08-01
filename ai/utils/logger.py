import logging
import sys

def setup_logger() -> logging.Logger:
    """Configure and return the application logger."""
    logger = logging.getLogger("ai_service")
    logger.setLevel(logging.INFO)
    
    # Avoid adding duplicate handlers
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(logging.INFO)
        
        # Log format containing timestamp, level, filename, line number, and message
        formatter = logging.Formatter(
            fmt="%(asctime)s | %(levelname)-8s | %(filename)s:%(lineno)d - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
    return logger

logger = setup_logger()
