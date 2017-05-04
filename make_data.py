import pandas as pd
import numpy as np

df = pd.read_csv("~/Downloads/sba_google_places_loan_data.csv")

df2 = df[['grossapproval', 'approvalfiscalyear', 'businesstype',
          'borrcity', 'borrname']]

city_values = {'borrcity': ['Berkeley', 'Concord', 'Fremont', 'Hayward',
                            'Oakland', 'San Francisco', 'San Jose',
                            'Santa Clara', 'Santa Cruz', 'Santa Rosa']}

row_mask = df2.isin(city_values).any(1)

df3 = df2[row_mask]

grouped = df3.groupby(['approvalfiscalyear', 'borrcity'])
grouped_approval = grouped['grossapproval']

df4 = grouped_approval.agg({'avg_approval': np.mean,
                            'count': len}).reset_index()


with open("/Users/trevor/Code/d3cesium/loans.json", 'w') as f:
    print('[', file=f)
    first_group = True
    for name, group in df4.groupby('borrcity'):
        if not first_group:
            print(', ', file=f)
        print('{', '"city": "{}"'.format(name),
              ', "avg_approval": ',
              list(map(lambda year, avg_approval: [year, avg_approval],
                       group['approvalfiscalyear'],
                       group['avg_approval'])),
              ', "count": ',
              list(map(lambda year, count: [year, count],
                       group['approvalfiscalyear'],
                       group['count'])),
              '}', file=f)
        first_group = False
    print(']', file=f)
