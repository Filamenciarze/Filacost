FROM python:3.11-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    libx11-6 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
    libxfixes3 libxi6 libxrandr2 libxrender1 libxtst6 libglib2.0-0 \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdbus-1-3 libgtk2.0-0 \
    libdrm2 libgbm1 libgtk-3-0 libpango-1.0-0 libpangocairo-1.0-0 bzip2 libpangoxft-1.0-0  libegl1\
    libxinerama1 libxss1 libasound2 curl unzip libgl1-mesa-glx libglu1-mesa && \
    apt-get clean

# Add user
RUN useradd -ms /bin/bash slicer
USER slicer
WORKDIR /home/slicer

# Download and extract PrusaSlicer AppImage
RUN curl -L -o PrusaSlicer.tar.bz2 https://github.com/prusa3d/PrusaSlicer/releases/download/version_2.7.4/PrusaSlicer-2.7.4+linux-x64-GTK3-202404050928.tar.bz2
RUN tar -xjf PrusaSlicer.tar.bz2
RUN mv /home/slicer/PrusaSlicer-2.7.4+linux-x64-GTK3-202404050928/bin/prusa-slicer /home/slicer
ENV PRUSA_EXEC=/home/slicer/prusa-slicer

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]

