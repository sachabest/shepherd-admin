# shepherd-admin
Admin backend for PennMed Shepherd

## Goals
* Upload data from CSV
* Review step to confirm data
* Send to Parse

## Details
* The review step should look extremely similar to Parse's backend. You should be able to view by object type (of which there are 3-5) and switch between just as you would in the data browser
* There are three object types: Complaint, Diagnosis, Test, Prescription, and Treatment
* https://www.parse.com/apps/shepherd--4/collections for more details
* Objects that do not exist should be created, but not duplicated. That is to say, if two new Complaints are introduced that have pointers to a new Treatment, only one new Treatment should be made. 

## Reach Goals
* Allow editing of all data once in place (after submission)
