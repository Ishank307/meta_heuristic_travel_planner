import json
from backend.app.services.prediction import predict_itinerary_service

req = {
  "city": "Mumbai",
  "days": 1,
  "preference": "time",
  "locations": [
    {"name": "Gateway of India", "lat": 18.922, "lng": 72.834, "rating": 4.5, "open_time": "08:00", "close_time": "20:00", "visit_duration": 60, "mandatory": False},
    {"name": "Marine Drive", "lat": 18.944, "lng": 72.823, "rating": 4.7, "open_time": "08:00", "close_time": "20:00", "visit_duration": 60, "mandatory": False}
  ]
}

print(predict_itinerary_service(req))
