GET _cluster/health

GET /_cat/shards?v
DELETE /meskaniaa

DELETE /query
GET /query/_search
{"from" : 0, "size" : 10000,
  "query": {
    "match_all": {}
  }
}

GET /query/_mapping
PUT /query
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings" : {
      "properties" : {
        "geometry" : {
          "properties" : {
            "coordinates" : {
              "type" : "geo_point"
            },
            "type" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            }
          }
        },
        "name" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "properties" : {
          "properties" : {
            "cumulative_sum_delay_aggregations" : {
              "properties" : {
                "avg" : {
                  "type" : "float"
                },
                "count" : {
                  "type" : "long"
                },
                "max" : {
                  "type" : "long"
                },
                "min" : {
                  "type" : "long"
                },
                "std_deviation" : {
                  "type" : "float"
                },
                "std_deviation_bounds" : {
                  "properties" : {
                    "lower" : {
                      "type" : "float"
                    },
                    "lower_population" : {
                      "type" : "float"
                    },
                    "lower_sampling" : {
                      "type" : "float"
                    },
                    "upper" : {
                      "type" : "float"
                    },
                    "upper_population" : {
                      "type" : "float"
                    },
                    "upper_sampling" : {
                      "type" : "float"
                    }
                  }
                },
                "std_deviation_population" : {
                  "type" : "float"
                },
                "std_deviation_sampling" : {
                  "type" : "float"
                },
                "sum" : {
                  "type" : "long"
                },
                "sum_of_squares" : {
                  "type" : "long"
                },
                "variance" : {
                  "type" : "float"
                },
                "variance_population" : {
                  "type" : "float"
                },
                "variance_sampling" : {
                  "type" : "float"
                }
              }
            },
            "per_ring" : {
              "properties" : {
                "buckets" : {
                  "properties" : {
                    "doc_count" : {
                      "type" : "long"
                    },
                    "from" : {
                      "type" : "long"
                    },
                    "key" : {
                      "type" : "text",
                      "fields" : {
                        "keyword" : {
                          "type" : "keyword",
                          "ignore_above" : 256
                        }
                      }
                    },
                    "to" : {
                      "type" : "long"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
}

GET /presov_streets
# Curent presov_streets ###################################
DELETE /presov_streets
PUT /presov_streets
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
GET /presov_streets/_doc/1

GET /presov_stops
# Curent presov_stops ###################################
DELETE /presov_stops
PUT /presov_stops
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
GET /presov_stops/_doc/1

GET /sad_stops
# Curent sad_stops ###################################
DELETE /sad_stops
PUT /sad_stops
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
GET /sad_stops/_doc/1

DELETE /bst
# bst #Spolu vsetko#############################
PUT /bst
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
    "mappings" : {
      "properties" : {
        "geometry" : {
          "properties" : {
            "coordinates" : {
              "type" : "geo_point"
            },
            "type" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            }
          }
        },
        "properties" : {
          "properties" : {
            "Angle" : {
              "type" : "long"
            },
            "BUS_STOP_NUM_1" : {
              "type" : "long"
            },
            "BUS_STOP_NUM_2" : {
              "type" : "long"
            },
            "BUS_STOP_ORDER_NUM" : {
              "type" : "long"
            },
            "BUS_STOP_SUB_NUM_1" : {
              "type" : "long"
            },
            "BUS_STOP_SUB_NUM_2" : {
              "type" : "long"
            },
            "CHANGE_OF_DELAY" : {
              "type" : "long"
            },
            "CasDay" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "CasPlanDay" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "CasPlanTime" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "CasTime" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "Current_Stop" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "Current_Time" : {
              "type" : "long"
            },
            "DELAY" : {
              "type" : "long"
            },
            "DIRECTION" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "Dir" : {
              "type" : "long"
            },
            "Dopravca" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "From" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "MeskaText" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "Nazov" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "Next_Stop" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "Order_In_Json_Id" : {
              "type" : "long"
            },
            "Order_In_Station" : {
              "type" : "long"
            },
            "PLANNED_ROAD" : {
              "type" : "long"
            },
            "PLANNED_START" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "REAL_ROAD" : {
              "type" : "long"
            },
            "ROUTE_NUMBER" : {
              "type" : "long"
            },
            "Street" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "To" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "Trip" : {
              "type" : "long"
            },
            "TripTime" : {
              "type" : "long"
            },
            "Type" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "VEHICLE_NUMBER" : {
              "type" : "long"
            },
            "Via" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "destination" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "destinationCityName" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "destinationStopName" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "isOnStop" : {
              "type" : "boolean"
            },
            "lastStopOrder" : {
              "type" : "long"
            },
            "lineID" : {
              "type" : "long"
            },
            "lineType" : {
              "type" : "long"
            },
            "vehicleID" : {
              "type" : "long"
            }
          }
        },
        "type" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        }
      }
    }
}
GET /bst/_mapping
GET /bst/_search?scroll=1m
{
  "from" : 0, "size" : 10000,
  "query": {
    "match_all": {}
  }
}

GET /bst/_doc/a1ZaRHcBpcxkJs2NoEQp
GET /bst/_search?scroll=1m
{
  "aggs": {
    "per_ring": {
      "geo_distance": { 
        "field":    "geometry.coordinates",
        "unit":     "m",
        "origin": {
          "lat":  49.01030346339127,
          "lon":   21.251420974731445
        },
        "ranges": [
          { "from": 0, "to": 50 }
        ]
      }
    },
    "cumulative_sum_delay_aggregations":{
      "extended_stats": {
        "field": "properties.DELAY"
      }
    }
  }
}

GET /bst/_search?scroll=1m
{
  "_source": ["type","geometry", "properties.DELAY"],
  "query": {
    "constant_score": {
      "filter": {
        "geo_bounding_box": {
          "geometry.coordinates": { 
            "top_left": {
              "lat":  48.99856,
              "lon": 21.27004
            },
            "bottom_right": {
              "lat":  48.98178,
              "lon": 21.25036
            }
          }
        }
      }
    }
  },
  "aggs": {
    "cumulative_sum_delay_aggregations":{
      "extended_stats": {
        "field": "properties.DELAY"
      }
    },
    "presov": {
      "geohash_grid": { 
        "field":     "geometry.coordinates",
        "precision": 1
      }
    }
  }
}

GET /bst/_search?scroll=1m
{
  "from" : 0, "size" : 10000,
 "query" : {
       "match" : { "properties.Type": "MHD" }
    }
}
GET /bst/_search?scroll=1m
{
  "from" : 0, "size" : 10000,
 "query" : {
       "match" : { "properties.Type": "SAD" }
    }
}

GET /bst/_search?scroll=1m
{
  "from" : 0, "size" : 10000,
 "query" : {
       "match" : { "properties.Type": "Train" }
    }
}

GET /weather/_mapping
DELETE /weather
# Weather #spolu###################
PUT /weather
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings" : {
      "properties" : {
        "geometry" : {
          "properties" : {
            "coordinates" : {
              "type" : "geo_point"
            },
            "type" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            }
          }
        },
        "properties" : {
          "properties" : {
            "Clouds_All" : {
              "type" : "long"
            },
            "Current_Time" : {
              "type" : "long"
            },
            "Id" : {
              "type" : "long"
            },
            "Main_FeelsLike" : {
              "type" : "float"
            },
            "Main_Humidity" : {
              "type" : "long"
            },
            "Main_Pressure" : {
              "type" : "long"
            },
            "Main_Temp" : {
              "type" : "float"
            },
            "Main_TempMax" : {
              "type" : "long"
            },
            "Main_TempMin" : {
              "type" : "float"
            },
            "Sunrise" : {
              "type" : "long"
            },
            "Sunset" : {
              "type" : "long"
            },
            "Type" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "Visibility" : {
              "type" : "long"
            },
            "Weather_Description" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "Weather_Icon" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "Weather_Id" : {
              "type" : "long"
            },
            "Weather_Main" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "Wind_Deg" : {
              "type" : "long"
            },
            "Wind_Speed" : {
              "type" : "long"
            }
          }
        },
        "type" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        }
      }
    }
}

GET /weather/_doc/
DELETE /weather
GET /weather/_search
{
  "from" : 0, "size" : 1000,
  "query": {
    "match_all": {}
  }
}



# MHD PRESOV ##############################
PUT /mhdpo
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
GET /mhdpo/_doc/
DELETE /mhdpo
GET /mhdpo/_search
{
  "from" : 0, "size" : 10000,
  "query": {
    "match_all": {}
  }
}
# Curent MhdPO ###################################
DELETE /current_mhdpo
PUT /current_mhdpo
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
GET /current_mhdpo/_doc/1
POST /current_mhdpo/_doc/1

# SAD PRESOV ##############################
PUT /sadpo
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
GET /sadpo/_doc/
DELETE /sadpo
GET /sadpo/_search
{
  "from" : 0, "size" : 1000,
  "query": {
    "match_all": {}
  }
}

# Curent SadPO ###################################
DELETE /current_sadpo
PUT /current_sadpo
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
GET /current_sadpo/_doc/1

DELETE /traffic_situation
# Traffic Situation ##############################
PUT /traffic_situation
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings" : {
      "properties" : {
        "geometry" : {
          "properties" : {
            "coordinates" : {
              "type" : "geo_point"
            },
            "type" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            }
          }
        },
        "properties" : {
          "properties" : {
            "Current_Time" : {
              "type" : "long"
            },
            "Type" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "category_Code" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "category_Name" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "city" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "delaySeconds" : {
              "type" : "long"
            },
            "description" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "district_AreaLevel" : {
              "type" : "long"
            },
            "district_ID" : {
              "type" : "long"
            },
            "district_Name" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "houseNoFirst" : {
              "type" : "long"
            },
            "houseNoSecond" : {
              "type" : "long"
            },
            "region_ID" : {
              "type" : "long"
            },
            "region_name" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "status_Code" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "status_Name" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "street" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "title" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            }
          }
        },
        "type" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        }
      }
    }
}

GET /traffic_situation/_mapping/
DELETE /traffic_situation
GET /traffic_situation/_search
{
  "from" : 0, "size" : 1000,
  "query": {
    "match_all": {}
  }
}

# Curent traffic_situation ###################################
DELETE /current_traffic_situation
PUT /current_traffic_situation
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
GET /current_traffic_situation/_doc/1

# Trains ##############################
PUT /trains
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
GET /trains/_doc/
DELETE /trains
GET /trains/_search
{
  "from" : 0, "size" : 1000,
  "query": {
    "match_all": {}
  }
}

# Curent trains###################################
DELETE /current_trains
PUT /current_trains
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
GET /current_trains/_doc/1

# WeatherPo ##############################
PUT /weather_po
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
"properties": {
"geometry": {
"properties": {
"coordinates": {
"type": "geo_point"
},
"type": {
"type": "text",
"fields": {
"keyword": {
"type": "keyword",
"ignore_above": 256
}
}
}
}
},
"properties": {
"properties": {
"Clouds_All": {
"type": "long"
},
"Current_Time": {
"type": "long"
},
"Id": {
"type": "long"
},
"Main_FeelsLike": {
"type": "float"
},
"Main_Humidity": {
"type": "long"
},
"Main_Pressure": {
"type": "long"
},
"Main_Temp": {
"type": "float"
},
"Main_TempMax": {
"type": "long"
},
"Main_TempMin": {
"type": "float"
},
"Sunrise": {
"type": "long"
},
"Sunset": {
"type": "long"
},
"Type": {
"type": "text",
"fields": {
"keyword": {
"type": "keyword",
"ignore_above": 256
}
}
},
"Visibility": {
"type": "long"
},
"Weather_Description": {
"type": "text",
"fields": {
"keyword": {
"type": "keyword",
"ignore_above": 256
}
}
},
"Weather_Icon": {
"type": "text",
"fields": {
"keyword": {
"type": "keyword",
"ignore_above": 256
}
}
},
"Weather_Id": {
"type": "long"
},
"Weather_Main": {
"type": "text",
"fields": {
"keyword": {
"type": "keyword",
"ignore_above": 256
}
}
},
"Wind_Deg": {
"type": "long"
},
"Wind_Speed": {
"type": "long"
}
}
},
"type": {
"type": "text",
"fields": {
"keyword": {
"type": "keyword",
"ignore_above": 256
}
}
}
}
}
}
GET /weather_po/_mapping/
DELETE /weather_po
GET /weather_po/_search
{
  "from" : 0, "size" : 1000,
  "query": {
    "match_all": {}
  }
}
# Curent weather_po###################################
DELETE /current_weather_po
PUT /current_weather_po
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
GET /current_weather_po/_doc/1


# WeatherKE ##############################
PUT /weather_ke
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
GET /weather_ke/_doc/
DELETE /weather_ke
GET /weather_ke/_search
{
  "from" : 0, "size" : 1000,
  "query": {
    "match_all": {}
  }
}
# Curent weather_ke###################################
DELETE /current_weather_ke
PUT /current_weather_ke
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
GET /current_weather_ke/_doc/1

# UB ##############################
PUT /ub
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
GET /ub/_doc/
DELETE /ub
GET /ub/_search
{
  "from" : 0, "size" : 1000,
  "query": {
    "match_all": {}
  }
}

