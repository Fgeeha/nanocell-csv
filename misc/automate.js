function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function qid(id) { return document.querySelector(id).click(); }



stg.rows = 15;
stg.cols = 6;
sheet.fixTop = false;
sheet.x = 0;
sheet.y = 0;
sheet.refresh();
csvHandle.reloadFile(true);

await sleep(1000);
for (i = 0; i < 2; i++) { stg.cols++; await sleep(20); }
await sleep(500);
for (i = 0; i < 10; i++) { stg.rows++; await sleep(7); }
await sleep(400);
for (i = 0; i < 6; i++) { stg.rows++; await sleep(7); }
await sleep(400);
sheet.fixTop = true; 
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
await sleep(500);
sheet.slctRange = true;
sheet.y = sheet.df.height-1;
sheet.slctRange = false;
sheet.slctRefresh(true);
await sleep(600);
sheet.expand();
sheet.refresh();
await sleep(600);
sheet.y=0;
sheet.slctRefresh(true);
await sleep(600);
for (i = 0; i < 3; i++) { sheet.x++;sheet.slctRefresh(true); await sleep(20); }
await sleep(600);
sheet.sort(sheet.x, true);

qid('img[title="about"]');
await sleep(1500);
qid('#closeDialog');