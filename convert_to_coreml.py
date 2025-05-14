import coremltools as ct
import tensorflow as tf
import keras

# Percorso del modello salvato localmente
saved_model_path = "saved_model"

# Carica il modello TensorFlow come TFSMLayer
model = keras.layers.TFSMLayer(saved_model_path, call_endpoint='serving_default')

# Esempio di input shape (batch, altezza, larghezza, canali)
input_shape = (1, 256, 256, 3)

# Converti in CoreML
mlmodel = ct.convert(
    model,
    inputs=[ct.TensorType(shape=input_shape)],
    convert_to="mlprogram"  # Necessario per modelli complessi
)

mlmodel.save("DeblurringModel.mlmodel")
print("Conversione completata! Modello salvato come DeblurringModel.mlmodel") 