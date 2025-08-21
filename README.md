"# RecommenderML" 

to start 

1. install all the necesarry imports
2. in bash go to the "project folder/landing-site/src" then type "uvicorn main:app --reload --host 0.0.0.0 --port 8000"
3. in terminal go to project folder and type "npm run dev"

This Project uses 2 Machine Learning Models one for the catgorization of jobs and the other is the role of the job
the categorization uses Random forest Classification with a 67% f1-score
the role of the job uses neural network specifically Sequential Model which hafve an f1 score of 91%

This Project also datascrap jobs but the options are very limited so i opted to just find a good dataset for the jobs

The Dataset used in both the machine learning are the job postings in 2024 by JobStreet
The Dataset used in the table to suggest jobs for the users are job postings in present that updates weekly these data also comes from Jobstreet
