function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function qid(id) { return document.querySelector(id).click(); }

var time_start = Date.now(); // Point A



stg.theme = "light";
stg.rows = 15;
stg.cols = 10;
sheet.fixTop = false;

sheet.refresh();
csvHandle.reloadFile(true);
sheet.x = 0;
sheet.y = 0;
sheet.slctRefresh();


await sleep(500);
for (i = 0; i < 10; i++) { stg.rows++; await sleep(7); }
await sleep(400);
for (i = 0; i < 6; i++) { stg.rows++; await sleep(7); }
await sleep(400);
sheet.fixTop = true; 
await sleep(400);
for (i = 0; i < 20; i++) { sheet.baseY ++;sheet.slctRefresh(false); await sleep(7); }
await sleep(400);
for (i = 0; i < 30; i++) { sheet.baseY --;sheet.slctRefresh(false); await sleep(7); }
await sleep(400);

sheet.x = 0;
sheet.y = 0;
sheet.refresh();
await sleep(400);
sheet.insert(3); //left 
await sleep(1000);
sheet.x = 0;
sheet.y = 0;
sheet.slctRefresh();
await sleep(400);
sheet.input("i");
await sleep(200);
sheet.inputField.value += "d";
await sleep(200);
sheet.inputField.blur();
sheet.y++;
sheet.slctRefresh();
sheet.refresh();
await sleep(800);
sheet.slctRange = true;
sheet.y = sheet.df.height-1;
sheet.slctRange = false;
sheet.slctRefresh(true);
await sleep(600);
for (i = 0; i < 7; i++) { sheet.baseY ++;sheet.slctRefresh(false); await sleep(7); }
await sleep(400);
sheet.expand();
sheet.refresh();
await sleep(600);
sheet.y=0;
sheet.slctRefresh(true);
await sleep(600);
for (i = 0; i < 3; i++) { sheet.x++;sheet.slctRefresh(true); await sleep(40); }
await sleep(600);
sheet.sort(sheet.x, true);
await sleep(1000);
for (i = 0; i < 3; i++) { sheet.x++;sheet.slctRefresh(true); await sleep(40); }
await sleep(600);
sheet.slctCol(sheet.x);
await sleep(600);
cmd.integer.run();
await sleep(600);
cmd.decimal.run();
await sleep(600);
for (i = 0; i < 10; i++) { sheet.baseY ++;sheet.slctRefresh(false); await sleep(3); }
await sleep(600);
for (i = 0; i < 32; i++) { sheet.baseY +=2;sheet.slctRefresh(false); await sleep(2); }
await sleep(2000);
qid('img[title="about"]');
await sleep(3000);
qid('#closeDialog');



var time_end = Date.now();   // Point B
console.log(`Time elapsed: ${time_end - time_start} ms`);

