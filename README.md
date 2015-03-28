#Data Visualization of FIFA Development Projects

##Summary
For this project, I’ve created a data visualization for the Goal programme data set of FIFA developments projects. 
The Goal Programme enables beneficiary member associations to implement projects designed to develop football in their countries. 
It is an expression of solidarity that gives national associations with few resources at their disposal the tools they need to function and grow.

*Information from FIFA official website http://www.fifa.com/aboutfifa/footballdevelopment/projects/goalprogramme/

The Goal Programme supports the following classes of projects:

- Headquarters
- Technical centre
- Football pitch
- Football academy (including creation of youth academies)
- IT projects (modernisation of national association computer systems)
- Other

I've divided my visualization on 4 tabs. On the first one you can explore overview of all projects by country.
On the others stored additional information which may explain some details of investments. 

Just press Play FIFA story button on the first tab to figure out most important points about Goal programme.

##Design

###Bar chart, Stacked bar chart and color hue
I use bar charts to show and compare different types of data. 
It allows reader to see countries, regions and project classes and compare their total budgets and projects number. 
In case of Budgets by region and class plot I've used stacked bar chart to explain how project classes distributed within each region.
I use color hue and separated each class by color and explain each color in legend.
For example, Western Europe has one of the highest budgets. Stacked bar chart explain it.  The main reason is the high cost of constructing headquarters.
 
###Choropleth
After receiving feedback I've decided to replace my plot on first tab with TOP30 countries by Choropleth.
I think it's good tool to overview how FIFA invest money in development projects worldwide.

###Color value 
To compare total budgets between countries I've use colors value from #b5cde1 to #315b7d.
I've match each color with total budget in legend.

###Visualization improvements after feedback
I've made some changes in my plots. 

- Wrangled my data and rename Football turf pitch into Football pitch and Training centres rename Football Academies. 
- Use choropleth on first tab instead long bar chart
- Made small bar charts with TOP 15 countries and TOP 15 budgets
- Add navbar with most important events 
- Add animation of "story" about most interesting projects
- Replace not clear sort option **Budget median** by **Projects number** on the 2-nd and 3-rd  tabs
- Change Axis labels and Bar labels text format
- Add tips on the last tab plot (Budget by region and class)
- Add some explanation text in storyline tips to clarify some nonobvious facts


##Feedback
I've received three feedback. It was very interesting and helpful.
All feedback I've collected on Udacity Discussion Forum thread here [http://discussions.udacity.com/t/i-need-feedback-in-project-5/13655/5][feedback]

###Feedback 1. from @ucaiado
You could split your visualization of budget by country also by classes, as you did in your chart by region. I'm curious where they spent money on Iceland =)

Also, you could flag the regions where happened some FIFA event on the timeline of your dataset…I'm guessing that it explains the top budgets by region showed... 
another option would be show the data of each year in an animation, like this example.

###Feedback 2. from @Charlie
Hi @alex_brazhenko, thanks for posting your project here for us to give feedback on!

I'm one of the evaluators for this project, but the comments I make here will be more informal as a user, not related to the rubric or any evaluation - I hope that's OK.

I like the overall layout very much, and appreciate the interactive options of filtering.

It wasn't clear to me what "Budget sum" and "Budget median" meant - this could do with some clarification. For example, I don't know why Budget by Country with Budget sum puts Iceland at the top, but then it moves to somewhere in the middle for Budget median.

My favourite plot was the budget by region and class - it was here that I felt the strongest comparisons could be made. I also quite liked the way it swished-in from the left-hand side! wink

The horizontal axis needs some work: perhaps this could be denominated in thousands or millions of dollars to avoid the overlap.

What's the difference between Football pitch and Football turf pitch? What's the difference between a Training centre and a Football academy?

I like @ucaiado's idea of highlighting specific FIFA events somehow.

I think that the 'story-telling' aspect of this plot needs to be developed a bit more. Having worked with the data, do you know what you would like to share with the viewer about it?
You might use this idea to make your plot more specific, or to add some text that makes suggestions of where the viewer should look to find the most compelling, interesting stories that this data reveals.


###Feedback 3. from @tyler_byers 
This is a great start on your visualization. Congrats on coming so far!

I like how you separated the various bar graphs into tabs. That makes it pretty easy and intuitive for me to be able to explore your charts.

I think I'm noticing what you want me to notice in each of the charts -- the budget that is going to various countries or regions or types of projects, along with the top-to-bottom ranking. I am a bit confused about the "Budget median" -- is that the median of the budget for each project for each country or region?

My next big question is regarding the Region budgets. I can't make it add up -- you say Sub-Saharan Africa has a larger budget than the European budget; however, if I go back to the Country tab, I cannot find ANY Sub-Saharan countries in the top 30 (maybe I'm missing one or two, but still the numbers wouldn't add up). Were the Sub-Saharan countries' budgets not divided by country in your data? You might want to make a note somewhere regarding this issue.

In your Budget by class tab, it looks like your lowest 3 bars have their labels cut-off. Maybe choose a different color, or put the labels at the end of the bars instead of inside the bars. Also, your x-axis numbers are getting a but scrunched at the right end.

In the final tab, the budget by region and class, there are a few regions where I really wouldn't know what the countries are in each region (C.W. of IND States ?). Also, the x-axis' numbers are all scrunched again, so I'd change the tick spacing for that.

Back in your Country tab, maybe you can color each country by the region it's in? Make those colors consistent with your Region tab...

Overall, it's a great start on your graphic, and my main takeaway is that FIFA is really investing a lot of money all over the world to improve facilities, and these improvements are across the board in terms of the types of improvements they are making.

Good luck finishing your project!


##Additional resources

- http://www.jeromecukier.net/wp-content/uploads/2012/10/d3-cheat-sheet.pdf
- http://www.jeromecukier.net/blog/2011/08/11/d3-scales-and-color/
- http://chimera.labs.oreilly.com/books/1230000000345/ch09.html
- http://stackoverflow.com/questions/22621865/how-to-update-an-svg-path-with-d3-js
- http://stackoverflow.com/questions/15315125/how-do-you-stop-setinterval-after-certain-number-of-iterations
- http://bl.ocks.org/duopixel/4063326
- http://bl.ocks.org/zanarmstrong/b7381e04dcded29b2b6f



[feedback]:[http://discussions.udacity.com/t/i-need-feedback-in-project-5/13655/5]
