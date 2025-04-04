import boto3

BUCKET_NAME = "argendata-reports"

s3 = boto3.client("s3")

# Crear bucket si no existe
try:
    s3.create_bucket(Bucket=BUCKET_NAME, CreateBucketConfiguration={"LocationConstraint": "us-east-1"})
    print(f"✅ Bucket {BUCKET_NAME} creado con éxito")
except Exception as e:
    print(f"⚠️ Error al crear el bucket: {e}")