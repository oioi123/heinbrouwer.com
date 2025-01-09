import numpy as np
import struct
from plyfile import PlyData
import os
import sys

def convert_ply_to_splat(input_ply, output_splat):
    try:
        # Get absolute paths
        input_path = os.path.abspath(input_ply)
        output_path = os.path.abspath(output_splat)
        
        print(f"Input path: {input_path}")
        print(f"Output path: {output_path}")
        
        if not os.path.exists(input_path):
            print(f"Error: Input file not found at {input_path}")
            return
            
        # Create output directory if it doesn't exist
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Read PLY file
        print("Reading PLY file...")
        ply = PlyData.read(input_path)
        vertices = ply['vertex']
        print(f"Found {len(vertices)} vertices")
        
        # Print available properties
        print("Available properties:", vertices[0].dtype.names)
        
        # Open output file in binary mode
        with open(output_path, 'wb') as f:
            # Write header
            f.write(b'SPLAT\x00')  # Magic number
            f.write(struct.pack('<I', len(vertices)))  # Number of splats
            
            # Write each splat
            for i, vertex in enumerate(vertices):
                # Position
                f.write(struct.pack('fff', 
                    float(vertex['x']), 
                    float(vertex['y']), 
                    float(vertex['z'])
                ))
                
                # SH Coefficients (colors)
                try:
                    f.write(struct.pack('fff',
                        float(vertex['f_dc_0']) + 0.5,
                        float(vertex['f_dc_1']) + 0.5,
                        float(vertex['f_dc_2']) + 0.5
                    ))
                except KeyError:
                    # If SH coefficients not found, use default values
                    f.write(struct.pack('fff', 0.5, 0.5, 0.5))
                
                # Scale and rotation (default values)
                scale = [0.01, 0.01, 0.01]
                rot = [1.0, 0.0, 0.0, 0.0]
                
                f.write(struct.pack('fff', *scale))
                f.write(struct.pack('ffff', *rot))
                
                # Print progress
                if i % 10000 == 0:
                    print(f"Processed {i}/{len(vertices)} vertices")
        
        print(f"Conversion complete. Output saved to {output_path}")
        
    except Exception as e:
        print(f"Error during conversion: {str(e)}")
        raise

if __name__ == "__main__":
    # Check if pip packages are installed
    try:
        import numpy
        import plyfile
    except ImportError:
        print("Required packages not found. Installing...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "numpy", "plyfile"])
        print("Packages installed successfully")

    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Set up input and output paths relative to public directory
    input_ply = os.path.join(script_dir, '..', 'public', 'models', 'desk.ply')
    output_splat = os.path.join(script_dir, '..', 'public', 'models', 'desk.splat')
    
    print("Converting PLY to SPLAT format...")
    convert_ply_to_splat(input_ply, output_splat)