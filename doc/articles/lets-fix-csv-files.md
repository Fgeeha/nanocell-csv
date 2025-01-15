# CSV files: A universal format, yet universally frustrating. Let’s fix that.

CSV files are the backbone of data exchange—simple, universal, and incredibly versatile. To this day, they are the best way to store tabular data in git repositories and probably the most universally used ETL file format (Extract Transform Load).  Yet, for something so ubiquitous, they often come with a frustrating reality: no tool seems to handle them quite right. Open a small file in Excel, and you're met with sluggish loading times and a minefield of potential data corruption. Try to preview a massive file, and you’re left twiddling your thumbs. Other specialized apps all seem archaic, are freemium at best, and often single-platform. CSV files are the unsung heroes of data tables, yet no tool seems to do them justice. It is time for change!

This is where [Nanocell-CSV](https://www.nanocell-csv.com/) comes in—a tool born out of necessity, frustration, and a relentless drive to simplify how we work with data.

Let me take you through the problem, the vision, and how I built a solution that’s fast, privacy-first, and available anywhere you need it.

## The Problem I Am Trying to Solve


Two use cases come to mind when working with CSV files:

1. **Small tables**, for which the data is input manually.  
2. **Large tables**, 1+ million rows, which are usually database extracts.

In the small table case, I want an MS Excel alternative that opens instantly, figures out the separator correctly, and does not corrupt my data. CSV is text and should remain that way. `+01` should stay `+01`, not be interpreted as `1`. I don't care about the graphs, visuals, and endless menus—I want to keep things simple. And, of course, I want to have all editing functions accessible from the keyboard.

In the large table case, I want to see its content instantly, but I don't really want to edit it. Actually, I would consider editing such tables outside of database tools and ETL pipelines as bad practice. I just want to view a large sample of the data, header and footer included, to get an idea of the file's content before moving on to expert tools to do my job. I have worked many years as a data analyst (even though my background is software engineering), and one of the main problems I came across is corrupted files that people opened with editors (typically MS Excel) and then overwrote with the editor's standards. How often did I wish the company-wide default CSV file editor was locked in view-only mode for large files?

In both cases, I want the tool to run locally as data privacy is essential, and I don't want my company to be at risk of a data leak. 

Furthermore, I want the tool to be available anywhere. I work at a big BIG company, and my computer is subject to an admin lock for any `.exe` file I try to run. I don't want to go through the tedious bureaucratic process of asking for permission to install this one app... So what if there was a way to bypass this?

## The choice of PWA

This last requirement of being cross-platform and not requiring a `.exe` installation file meant that [Nanocell-CSV](https://www.nanocell-csv.com/) would have to live as an extension of another app. Three options came to mind: the terminal, an IDE, or the browser. As much as I was seduced by the idea of building a Rust CLI application, I thought it would be more fun for the project to be accessible by anyone. Furthermore, I didn't want to live and die with an IDE. So... web app it is!

The project originally started off as a Chrome web app available in the Chrome Web Store. It was 2020, during the COVID lockdown, and I wanted to keep myself busy. I developed it locally until it reached a reasonable level of maturity after over a year. I paid my Chrome developer fee to publish the app, and then: "Chrome web apps are discontinued. You cannot release your app on the Chrome Web Store at this time." I was devastated. A little bit of research made me understand that if Chrome web apps were discontinued, it was because PWA (Progressive Web App) technology was being developed and was very promising. I slowly started to transition my Chrome web app to a PWA. At the time, the file handle system was far from stable and mature. I realized that each time I wanted to open or save a file, the user had to be prompted for confirmation. Hard to advertise speed and efficiency when `Ctrl + S` turns into `Ctrl + S > prompt > click to confirm`. At a dead end, I decided to abandon the project. Every six months or so, I checked the PWA file system API to see if things might have changed. It was only in 2024 that the long-awaited feature came live: a simple checkbox in the prompt that reads, "Remember my choice for these file types: [...]". We're back in the game ! 

## Adding in a Few Cool Features

As mentioned previously, one of my major pain points is data corrupted by MS Excel, mainly caused by people with regional settings that use a comma as the decimal separator. For example, `1.5` becoming `1,5`. This does not fit well in a **Comma** Separated Value file.  
So I've added a data validation feature that checks that all real numbers are written with a dot and not a comma. 

I also have an issue with financial data that is not saved with two digits after the decimal point. `$1.50` becomes `$1.5`, so I added a feature to round the column to two decimals. And, of course, an equivalent function to round everything up to integers if needed. 

Quotes and commas are, of course, tolerated in most CSV file standards but are considered bad practice. I've added text linting to highlight cell values that contain such unorthodox characters. Another feature also enables the user to replace all `,` with `-` and all `"` with `|`.

## Roadmap and Future Plans

As a lightweight editor, I believe [Nanocell-CSV](https://www.nanocell-csv.com/) is fairly mature. On the other hand, as a large database extract quick viewer, a lot more can be done. The major enhancements I will be working on in the foreseeable future will be to analyze those big files in the background as the quick view is displayed to offer in-depth analysis of the data. Typically, a correlation heatmap of each column or a histogram of value occurrences, etc.

Of course, these are just a few ideas. I want this project to be community-driven, so don't hesitate to tell me where to go from here. What started as a one-man engineering project has now grown into a shared journey of innovation and collaboration with all. Join the ride!

[Link to Nanocell-CSV](https://www.nanocell-csv.com/)
