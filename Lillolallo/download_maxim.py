import tensorflow as tf
import tensorflow_hub as hub

# URL del modello MAXIM su TensorFlow Hub
hub_url = "https://tfhub.dev/sayakpaul/maxim_s-3_deblurring_gopro/1"

# Cartella dove salvare il modello
export_path = "maxim_saved_model"

# Scarica e salva il modello
model = hub.load(hub_url)
tf.saved_model.save(model, export_path)
print(f"Modello MAXIM scaricato e salvato in: {export_path}") 