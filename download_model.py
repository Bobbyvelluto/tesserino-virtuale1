import tensorflow as tf
import tensorflow_hub as hub

# URL del modello su TensorFlow Hub
hub_url = "https://tfhub.dev/sayakpaul/maxim_s-3_deblurring_gopro/1"

# Cartella dove salvare il modello
export_path = "saved_model"

# Scarica e salva il modello
model = hub.load(hub_url)
tf.saved_model.save(model, export_path)
print(f"Modello scaricato e salvato in: {export_path}") 