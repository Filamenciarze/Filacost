from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from slice import process_file
import os

app = FastAPI()

@app.post("/slice")
async def slice_file(stl_file: UploadFile = File(...)):
    stl_path = f"/tmp/{stl_file.filename}"
    with open(stl_path, "wb") as f:
        f.write(await stl_file.read())

    result = process_file(stl_path)
    return JSONResponse(result) 