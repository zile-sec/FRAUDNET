import os
import joblib
import numpy as np
import tensorflow as tf
from sklearn.cluster import KMeans
from sklearn.tree import DecisionTreeClassifier

# Ensure directory exists
os.makedirs("ml_models", exist_ok=True)

# 1. Dummy KMeans (expects 30 features)
km = KMeans(n_clusters=2).fit(np.zeros((10, 30)))
joblib.dump(km, "ml_models/kmeans.pkl")

# 2. Dummy Decision Tree (expects 30 features)
dt = DecisionTreeClassifier().fit(np.zeros((10, 30)), [0, 1]*5)
joblib.dump(dt, "ml_models/dt_model.pkl")

# 3. Dummy Deep Learning Model (expects 30 features)
model = tf.keras.Sequential([
    tf.keras.layers.Dense(16, activation="relu", input_shape=(30,)),
    tf.keras.layers.Dense(1, activation="sigmoid")
])
model.save("ml_models/deep_model.h5")
