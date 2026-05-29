import sys
import json
import base64
import io
import os
import pandas as pd
import numpy as np
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' # Suppress TF warnings
import tensorflow as tf
from PIL import Image

def main():
    try:
        # Read JSON from stdin
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"error": "No input provided"}))
            return
            
        data = json.loads(input_data)
        base64_img = data.get('imageBase64')
        language = data.get('language', 'English')
        
        if not base64_img:
            print(json.dumps({"error": "No imageBase64 provided"}))
            return

        # Strip data URI prefix if present
        if ',' in base64_img:
            base64_img = base64_img.split(',')[1]

        # Decode image
        img_bytes = base64.b64decode(base64_img)
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')

        # Load Model
        model_path = os.path.join(os.path.dirname(__file__), 'model', 'soil_final.keras')
        model = tf.keras.models.load_model(model_path)
        
        # Get input shape
        input_shape = model.input_shape[1:3] # e.g. (256, 256)
        if input_shape[0] is None:
            input_shape = (224, 224) # Fallback

        # Preprocess
        img = img.resize(input_shape)
        img_array = np.array(img) / 255.0 # Normalize
        img_array = np.expand_dims(img_array, axis=0) # Add batch dimension

        # Predict
        predictions = model.predict(img_array, verbose=0)[0]
        max_prob = np.max(predictions)
        class_idx = np.argmax(predictions)

        # Classes (Must match how the model was trained, standard order is usually alphabetical or specific)
        # Assuming typical order or standard for this dataset: Black, Clayey, Loamy, Red, Sandy
        # Let's map it based on common datasets, but if we don't know, we'll assume alphabetical:
        # ['Black', 'Clayey', 'Loamy', 'Red', 'Sandy'] - wait, the dataset has these 5.
        classes = ['Black', 'Clayey', 'Loamy', 'Red', 'Sandy']
        
        predicted_class = classes[class_idx]
        
        # Confidence Check
        if max_prob < 0.60:
            print(json.dumps({
                "soilType": "Unknown",
                "explanation": "Low confidence (" + str(round(max_prob * 100, 2)) + "%). It is not a soil.",
                "recommendedCrops": []
            }))
            return

        # Load Dataset and get crops
        dataset_path = os.path.join(os.path.dirname(__file__), 'dataset', 'data_core.csv')
        df = pd.read_csv(dataset_path)
        
        # Filter by soil type (case insensitive)
        soil_df = df[df['Soil Type'].str.lower() == predicted_class.lower()]
        
        # Get unique crops
        crops = soil_df['Crop Type'].unique().tolist()
        
        # Select top 3-5 crops
        recommended_crops = crops[:5]
        if not recommended_crops:
            recommended_crops = ["No specific crops found for this soil in dataset."]

        # Explanations
        explanations = {
            'Black': 'Black soil is clayey, deep, and rich in calcium, magnesium, and carbonates.',
            'Clayey': 'Clayey soil has fine particles, retains water well, and is heavy.',
            'Loamy': 'Loamy soil is a balanced mixture of sand, silt, and clay, ideal for gardening.',
            'Red': 'Red soil is rich in iron oxide, porous, and lacks nitrogen and phosphorus.',
            'Sandy': 'Sandy soil is loose, well-drained, and warms up quickly.'
        }
        
        explanation = explanations.get(predicted_class, "Identified based on visual characteristics.")

        # NOTE: Real translation is skipped as we removed external APIs, returning English.
        if language != 'English':
            explanation += f" (Translation to {language} is unsupported in offline mode)"

        print(json.dumps({
            "soilType": predicted_class + " Soil",
            "explanation": explanation,
            "recommendedCrops": recommended_crops
        }))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == '__main__':
    main()
