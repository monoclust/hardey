from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Hardey"
    database_url: str = "sqlite:///./hardey.db"
    api_host: str = "127.0.0.1"
    api_port: int = 8765
    model_config = SettingsConfigDict(env_prefix="HARDEY_", env_file=".env", extra="ignore")


settings = Settings()
