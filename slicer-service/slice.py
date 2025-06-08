import subprocess
import os

def process_file(stl_path: str):
    gcode_path = "/tmp/output.gcode"
    config_path = "profile/slicer_config.ini"

    command = [
        os.environ.get("PRUSA_EXEC"),
        stl_path,
        "--export-gcode",
        "--load", config_path,
        "--output", gcode_path
    ]

    try:
        subprocess.run(command, check=True)
    
        filament_cost = None

        with open(gcode_path, "r") as f:
            for line in f:
                if line.startswith("; filament cost = "):
                    filament_cost = float(line.strip().split(" = ")[1])

        return {
            "cost": filament_cost
        }


    except Exception as e:
        return {"error": str(e)}
