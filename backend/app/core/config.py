from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "Jai Rakshak — AI Flood Prediction & Early Warning API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DEBUG: bool = False
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    
    # Demonstration & Telemetry Mode
    SIMULATION_MODE: bool = True
    
    # Thresholds (Central Water Commission & IMD)
    HEAVY_RAINFALL_THRESHOLD_MM: float = 64.5
    VERY_HEAVY_RAINFALL_THRESHOLD_MM: float = 115.6
    EXTREME_RAINFALL_THRESHOLD_MM: float = 204.4
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
