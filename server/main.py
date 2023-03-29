from server import app

@app.route('/')
def index():
  return {'text': 'Hello World'}