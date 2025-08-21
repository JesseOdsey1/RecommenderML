"# RecommenderML" 

to start 

1. install all the necesarry imports via "pip install -r requirements.txt" on the terminal
2. in bash go to the "project folder/landing-site/src" then type "uvicorn main:app --reload --host 0.0.0.0 --port 8000"
3. in terminal go to project folder and type "npm run dev"

This Project uses 2 Machine Learning Models one for the catgorization of jobs and the other is the role of the job
"https://huggingface.co/datasets/azrai99/job-dataset/commit/fe7a4352cb33787d4bd71b37b0905824204d4816"
the categorization uses Random forest Classification with a 67% f1-score
the role of the job uses neural network specifically Sequential Model which hafve an f1 score of 91%

This Project also datascrap jobs but the options are very limited so i opted to just find a good dataset for the jobs
"ReactOk" for the data scrap
"https://www.kaggle.com/datasets/azraimohamad/jobstreet-all-job-dataset/data" for the dataset

The Dataset used in both the machine learning are the job postings in 2024 by JobStreet
The Dataset used in the table to suggest jobs for the users are job postings in present that updates weekly these data also comes from Jobstreet
