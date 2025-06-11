import subprocess
import os
import re

def process_file(stl_path: str):
    gcode_path = "/tmp/output.gcode"
    config_path = "profile/slicer_config.ini"
    m73_pattern = re.compile(r"M73\s+P(\d+)\s+R(\d+)", re.IGNORECASE)
    max_remaining = None

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
        hours = None
        minutes = None
        seconds = None

        with open(gcode_path, "r") as f:
            for line in f:
                match = m73_pattern.search(line)
                if line.startswith("; filament cost = "):
                    filament_cost = float(line.strip().split(" = ")[1])
                if match:
                    remaining_minutes = int(match.group(2))
                    if max_remaining is None or remaining_minutes > max_remaining:
                        max_remaining = remaining_minutes

        if max_remaining is not None:
            total_minutes = max_remaining
            hours = total_minutes // 60
            minutes = total_minutes % 60
            seconds = total_minutes * 60

        est_time = f"{hours}:{minutes}"
        return {
            "cost": filament_cost,
            "est_time_display": est_time,
            "est_time_seconds": seconds
        }


    except Exception as e:
        return {"error": str(e)}
