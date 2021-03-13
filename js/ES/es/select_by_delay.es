GET /bst/_search
{ "query" : { "match_all" : {} } }

GET /bst/_search?scroll=1m
{
 
 "query" : {
      "bool": {
      "must": {
        "match_all": {}
      },
      "filter": {
        "geo_shape": {
          "location": {
            "shape": {
              "type": "point"
          
            }
          }
        }
      }
      }
 }
}

GET /bst/_search?scroll=100m
{
  "from" : 0, "size" : 1,
  "query": {
    "match_all": {}
  }
}

GET /bst/_search?scroll=10m
{ 
  
  "_source": ["type","geometry", "properties.DELAY","properties.CHANGE_OF_DELAY"],
  
 "query" : {
       "match_all": {}
    }
}

GET /bst/_search?scroll=1m
{
    "from": 0,
    "size": 10000,
    "query": {
        "match": {
            "properties.Type": "MHD"
        }
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
       "match" : { "properties.Type": "Train"}
    }
}

//DELAY
GET /bst/_search
{"query" : {
       "match" : { "properties.Type": "SAD" }
    },
        "aggs": {
            "range": {
                "date_range": {
                    "field": "properties.Current_Time",
                    "ranges": [
                        { "to":   "1611595106506" }, 
                        { "from": "1611670936884" }
                    ]
                }
            }
        }
    }

// CHANGE_OF_DELAY
GET /bst/_search?scroll=1m
{
  "from" : 0, "size" : 10000,
  "query": {
    "match_all": {}
  },
  "script_fields" : {
            "geometry" : {
                "script" : "params['_source']['geometry']"
            },
            "change_of_delay" : {
                "script" : "params['_source']['properties']['CHANGE_OF_DELAY']"
            }
        },
        "_source": false
}

//Get All current Stop
GET /bst/_search?scroll=1m
{
  "from" : 0, "size" : 10000,
  "query": {
    "match_all": {}
  },
  "script_fields" : {
            "location" : {
                "script" : "params['_source']['geometry']"
            }
        },
        "_source": false
}


