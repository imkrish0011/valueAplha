import re

data = """1,"Mar 28, Sat",7:30 PM,Royal Challengers Bengaluru vs Sunrisers Hyderabad,"M. Chinnaswamy Stadium, Bengaluru"
2,"Mar 29, Sun",7:30 PM,Mumbai Indians vs Kolkata Knight Riders,"Wankhede Stadium, Mumbai"
3,"Mar 30, Mon",7:30 PM,Rajasthan Royals vs Chennai Super Kings,"ACA Stadium, Barsapara, Guwahati"
4,"Mar 31, Tue",7:30 PM,Punjab Kings vs Gujarat Titans,"Maharaja Yadavindra Singh Intl. Stadium, New Chandigarh"
5,"Apr 1, Wed",7:30 PM,Lucknow Super Giants vs Delhi Capitals,"BRSABV Ekana Cricket Stadium, Lucknow"
6,"Apr 2, Thu",7:30 PM,Kolkata Knight Riders vs Sunrisers Hyderabad,"Eden Gardens, Kolkata"
7,"Apr 3, Fri",7:30 PM,Chennai Super Kings vs Punjab Kings,"M. A. Chidambaram Stadium, Chennai"
8,"Apr 4, Sat",3:30 PM,Delhi Capitals vs Mumbai Indians,"Arun Jaitley Stadium, Delhi"
9,"Apr 4, Sat",7:30 PM,Gujarat Titans vs Rajasthan Royals,"Narendra Modi Stadium, Ahmedabad"
10,"Apr 5, Sun",3:30 PM,Sunrisers Hyderabad vs Lucknow Super Giants,"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad"
11,"Apr 5, Sun",7:30 PM,Royal Challengers Bengaluru vs Chennai Super Kings,"M. Chinnaswamy Stadium, Bengaluru"
12,"Apr 6, Mon",7:30 PM,Kolkata Knight Riders vs Punjab Kings,"Eden Gardens, Kolkata"
13,"Apr 7, Tue",7:30 PM,Rajasthan Royals vs Mumbai Indians,"ACA Stadium, Barsapara, Guwahati"
14,"Apr 8, Wed",7:30 PM,Delhi Capitals vs Gujarat Titans,"Arun Jaitley Stadium, Delhi"
15,"Apr 9, Thu",7:30 PM,Kolkata Knight Riders vs Lucknow Super Giants,"Eden Gardens, Kolkata"
16,"Apr 10, Fri",7:30 PM,Rajasthan Royals vs Royal Challengers Bengaluru,"ACA Stadium, Barsapara, Guwahati"
17,"Apr 11, Sat",3:30 PM,Punjab Kings vs Sunrisers Hyderabad,"Maharaja Yadavindra Singh Intl. Stadium, New Chandigarh"
18,"Apr 11, Sat",7:30 PM,Chennai Super Kings vs Delhi Capitals,"M. A. Chidambaram Stadium, Chennai"
19,"Apr 12, Sun",3:30 PM,Lucknow Super Giants vs Gujarat Titans,"BRSABV Ekana Cricket Stadium, Lucknow"
20,"Apr 12, Sun",7:30 PM,Mumbai Indians vs Royal Challengers Bengaluru,"Wankhede Stadium, Mumbai"
21,"Apr 13, Mon",7:30 PM,Sunrisers Hyderabad vs Rajasthan Royals,"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad"
22,"Apr 14, Tue",7:30 PM,Chennai Super Kings vs Kolkata Knight Riders,"M. A. Chidambaram Stadium, Chennai"
23,"Apr 15, Wed",7:30 PM,Royal Challengers Bengaluru vs Lucknow Super Giants,"M. Chinnaswamy Stadium, Bengaluru"
24,"Apr 16, Thu",7:30 PM,Mumbai Indians vs Punjab Kings,"Wankhede Stadium, Mumbai"
25,"Apr 17, Fri",7:30 PM,Gujarat Titans vs Kolkata Knight Riders,"Narendra Modi Stadium, Ahmedabad"
26,"Apr 18, Sat",3:30 PM,Royal Challengers Bengaluru vs Delhi Capitals,"M. Chinnaswamy Stadium, Bengaluru"
27,"Apr 18, Sat",7:30 PM,Sunrisers Hyderabad vs Chennai Super Kings,"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad"
28,"Apr 19, Sun",3:30 PM,Kolkata Knight Riders vs Rajasthan Royals,"Eden Gardens, Kolkata"
29,"Apr 19, Sun",7:30 PM,Punjab Kings vs Lucknow Super Giants,"Maharaja Yadavindra Singh Intl. Stadium, New Chandigarh"
30,"Apr 20, Mon",7:30 PM,Gujarat Titans vs Mumbai Indians,"Narendra Modi Stadium, Ahmedabad"
31,"Apr 21, Tue",7:30 PM,Sunrisers Hyderabad vs Delhi Capitals,"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad"
32,"Apr 22, Wed",7:30 PM,Lucknow Super Giants vs Rajasthan Royals,"BRSABV Ekana Cricket Stadium, Lucknow"
33,"Apr 23, Thu",7:30 PM,Mumbai Indians vs Chennai Super Kings,"Wankhede Stadium, Mumbai"
34,"Apr 24, Fri",7:30 PM,Royal Challengers Bengaluru vs Gujarat Titans,"M. Chinnaswamy Stadium, Bengaluru"
35,"Apr 25, Sat",3:30 PM,Delhi Capitals vs Punjab Kings,"Arun Jaitley Stadium, Delhi"
36,"Apr 25, Sat",7:30 PM,Rajasthan Royals vs Sunrisers Hyderabad,"Sawai Mansingh Stadium, Jaipur"
37,"Apr 26, Sun",3:30 PM,Gujarat Titans vs Chennai Super Kings,"Narendra Modi Stadium, Ahmedabad"
38,"Apr 26, Sun",7:30 PM,Lucknow Super Giants vs Kolkata Knight Riders,"BRSABV Ekana Cricket Stadium, Lucknow"
39,"Apr 27, Mon",7:30 PM,Delhi Capitals vs Royal Challengers Bengaluru,"Arun Jaitley Stadium, Delhi"
40,"Apr 28, Tue",7:30 PM,Punjab Kings vs Rajasthan Royals,"Maharaja Yadavindra Singh Intl. Stadium, New Chandigarh"
41,"Apr 29, Wed",7:30 PM,Mumbai Indians vs Sunrisers Hyderabad,"Wankhede Stadium, Mumbai"
42,"Apr 30, Thu",7:30 PM,Gujarat Titans vs Royal Challengers Bengaluru,"Narendra Modi Stadium, Ahmedabad"
43,"May 1, Fri",7:30 PM,Rajasthan Royals vs Delhi Capitals,"Sawai Mansingh Stadium, Jaipur"
44,"May 2, Sat",7:30 PM,Chennai Super Kings vs Mumbai Indians,"M. A. Chidambaram Stadium, Chennai"
45,"May 3, Sun",3:30 PM,Sunrisers Hyderabad vs Kolkata Knight Riders,"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad"
46,"May 3, Sun",7:30 PM,Gujarat Titans vs Punjab Kings,"Narendra Modi Stadium, Ahmedabad"
47,"May 4, Mon",7:30 PM,Mumbai Indians vs Lucknow Super Giants,"Wankhede Stadium, Mumbai"
48,"May 5, Tue",7:30 PM,Delhi Capitals vs Chennai Super Kings,"Arun Jaitley Stadium, Delhi"
49,"May 6, Wed",7:30 PM,Sunrisers Hyderabad vs Punjab Kings,"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad"
50,"May 7, Thu",7:30 PM,Lucknow Super Giants vs Royal Challengers Bengaluru,"BRSABV Ekana Cricket Stadium, Lucknow"
51,"May 8, Fri",7:30 PM,Delhi Capitals vs Kolkata Knight Riders,"Arun Jaitley Stadium, Delhi"
52,"May 9, Sat",7:30 PM,Rajasthan Royals vs Gujarat Titans,"Sawai Mansingh Stadium, Jaipur"
53,"May 10, Sun",3:30 PM,Chennai Super Kings vs Lucknow Super Giants,"M. A. Chidambaram Stadium, Chennai"
54,"May 10, Sun",7:30 PM,Royal Challengers Bengaluru vs Mumbai Indians,"SVNS Intl. Cricket Stadium, Raipur"
55,"May 11, Mon",7:30 PM,Punjab Kings vs Delhi Capitals,"HPCA Stadium, Dharamshala"
56,"May 12, Tue",7:30 PM,Gujarat Titans vs Sunrisers Hyderabad,"Narendra Modi Stadium, Ahmedabad"
57,"May 13, Wed",7:30 PM,Royal Challengers Bengaluru vs Kolkata Knight Riders,"SVNS Intl. Cricket Stadium, Raipur"
58,"May 14, Thu",7:30 PM,Punjab Kings vs Mumbai Indians,"HPCA Stadium, Dharamshala"
59,"May 15, Fri",7:30 PM,Lucknow Super Giants vs Chennai Super Kings,"BRSABV Ekana Cricket Stadium, Lucknow"
60,"May 16, Sat",7:30 PM,Kolkata Knight Riders vs Gujarat Titans,"Eden Gardens, Kolkata"
61,"May 17, Sun",3:30 PM,Punjab Kings vs Royal Challengers Bengaluru,"HPCA Stadium, Dharamshala"
62,"May 17, Sun",7:30 PM,Delhi Capitals vs Rajasthan Royals,"Arun Jaitley Stadium, Delhi"
63,"May 18, Mon",7:30 PM,Chennai Super Kings vs Sunrisers Hyderabad,"M. A. Chidambaram Stadium, Chennai"
64,"May 19, Tue",7:30 PM,Rajasthan Royals vs Lucknow Super Giants,"Sawai Mansingh Stadium, Jaipur"
65,"May 20, Wed",7:30 PM,Kolkata Knight Riders vs Mumbai Indians,"Eden Gardens, Kolkata"
66,"May 21, Thu",7:30 PM,Chennai Super Kings vs Gujarat Titans,"M. A. Chidambaram Stadium, Chennai"
67,"May 22, Fri",7:30 PM,Sunrisers Hyderabad vs Royal Challengers Bengaluru,"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad"
68,"May 23, Sat",7:30 PM,Lucknow Super Giants vs Punjab Kings,"BRSABV Ekana Cricket Stadium, Lucknow"
69,"May 24, Sun",3:30 PM,Mumbai Indians vs Rajasthan Royals,"Wankhede Stadium, Mumbai"
70,"May 24, Sun",7:30 PM,Kolkata Knight Riders vs Delhi Capitals,"Arun Jaitley Stadium, Delhi" """

team_map = {
    'Royal Challengers Bengaluru': 'RCB',
    'Sunrisers Hyderabad': 'SRH',
    'Mumbai Indians': 'MI',
    'Kolkata Knight Riders': 'KKR',
    'Rajasthan Royals': 'RR',
    'Chennai Super Kings': 'CSK',
    'Punjab Kings': 'PBKS',
    'Gujarat Titans': 'GT',
    'Lucknow Super Giants': 'LSG',
    'Delhi Capitals': 'DC'
}

import csv
from io import StringIO

f = StringIO(data)
reader = csv.reader(f)

print("export const MATCH_SCHEDULE = [")
for row in reader:
    match_id = f"m{row[0]}"
    date_str = row[1]  # 'Mar 28, Sat' -> 'Mar 28, 2026'
    
    # parse month and day
    date_parts = date_str.split(',')
    month_day = date_parts[0].strip()
    full_date = f"{month_day}, 2026"

    # convert time
    time_str = row[2]  # '7:30 PM' -> '19:30'
    t, ampm = time_str.split(' ')
    h, m = t.split(':')
    h = int(h)
    if ampm == 'PM' and h != 12:
        h += 12
    if ampm == 'AM' and h == 12:
        h = 0
    formatted_time = f"{h:02d}:{m:02d}"

    teams = row[3]
    team_a_name, team_b_name = teams.split(' vs ')
    
    team_a_short = team_map.get(team_a_name, '')
    team_b_short = team_map.get(team_b_name, '')

    venue = row[4]

    print(f"  {{ id: '{match_id}', teamA: {{ name: '{team_a_name}', short: '{team_a_short}' }}, teamB: {{ name: '{team_b_name}', short: '{team_b_short}' }}, date: '{full_date}', time: '{formatted_time}', venue: '{venue}', league: 'TATA IPL 2026' }},")

print("];")
