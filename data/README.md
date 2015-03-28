# Codebook of data

###fifa_all_projects.csv

Main file with all data. It contains the following features: 

- Number - number of project
- Source.Url - url of project description on FIFA official website
- Country	
- Region - (ASIA (EX. NEAR EAST), BALTICS, C.W. OF IND. STATES, EASTERN EUROPE, LATIN AMER. & CARIB, NEAR EAST, NORTHERN AFRICA, NORTHERN AMERICA, OCEANIA, SUB-SAHARAN AFRICA, WESTERN EUROPE)
- Class	- (Football academy, Football pitch, Headquarters, IT projects, Other, Technical centre) 
- Project.Approval.Date	
- Project.Location	 
- Project.Description 
- Goal.Project.Number - number of project for current country
- Objectives - main goals of project	
- TotalBudget - projects budget
- id - country code in ISO 3166-1 alpha-3	
- Project.Approval.Year - year of project approval

###fifa_by_country.csv

File aggregated from `fifa_all_projects.csv` in R Studio.
Data were grouped by Country and Years and reshaped by `cast` function by `Project.Approval.Year` variable.

Contains the following fields:

- Country	
- id	
- Region	
- [2000 ... 2014]	
- TotalBudget	
- n - projects number 

###fifa_by_region.csv
File aggregated by similar way as `fifa_by_country.csv` and reshaped by `class` variable

- Region	
- Other	
- IT projects	
- Football academy	
- Technical centre	
- Football pitch	
- Headquarters	
- TotalBudget	
- n

###fifa_by_class.csv
File aggregated by `Class` feature

- Class	
- TotalBudget	
- n

###storyline.csv

This file made by hand to showcase some "story" about Goal programme from 2000 to 2014.

- year	- year 
- place	- City, Country or Region of event
- name	- name of event
- desc	- short description of event
- value	
- lat - 	latitude 
- lon -  longitude 


###world_countries.json
json file to draw a World map in d3.

















