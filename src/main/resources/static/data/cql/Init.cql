//set MetadataTypes
MERGE (n:MetadataTypes{name:"MetadataTypes"})
set n.values = ["Application","Service","Queue","Batch","Data", "API"]

//Add to MetadataTypes
MERGE (n:MetadataTypes{ name:"MetadataTypes"})
set n.values = n.values + "API"

//**********************************************//

//set to MetadataRelations
MERGE (n:MetadataRelations {name="MetadataRelations"})
set n.values = ["Depends On","Has","Contained In"]

//add to MetadataRelations
MERGE (n:MetadataRelations {name="MetadataRelations"})
set n.values = n.values + ""


//**********************************************//

//New App
MERGE (n:Application{ name:""})