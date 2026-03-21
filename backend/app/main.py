from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError, HTTPException
from fastapi.encoders import jsonable_encoder
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from alembic.config import Config
from alembic import command
from fastapi.responses import JSONResponse
from app.routers import patients
from app.exceptions import SavantAPiException


async def lifespan(app:FastAPI):
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    yield


app = FastAPI(
    title="Savant Healthcare API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    #allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(SavantAPiException)
async def savant_exception_handler(request: Request, exc:SavantAPiException):
    return JSONResponse(
        status_code = exc.status_code,
        content={"error_info": exc.error_details}
    )

@app.exception_handler(RequestValidationError)
async def request_validation_error_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code = 400,
        content={"error_info": jsonable_encoder(exc.errors())}
    )

@app.exception_handler(HTTPException)
async def global_http_exception_handler(request: Request, exc: HTTPException):
    if exc.status_code == 404:
        return JSONResponse(
            status_code = exc.status_code,
            content={"error_info": f"Path {request.url.path} doesn't exist"}
        )

    if exc.status_code == 405:
        return JSONResponse(
            status_code = exc.status_code,
            content={"error_info": "Method is not allowed"}
        )

    return JSONResponse(
            status_code = exc.status_code,
            content={"error_info": exc.detail}
        )

@app.exception_handler(Exception)
async def internal_server_error_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code = 500,
        content={"error_info": "Internal Server Error"}
    )




app.include_router(patients.router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "ok"}