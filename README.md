# madspreston.com: portfolio site

Pages: `index.html` (home), `work.html` (all work), the three case studies (`youth-era.html`, `brand-photography.html`, `uplift-at-work.html`), and three Youth Era project pages (`print-materials.html`, `erazine.html`, `clackamas-renovation.html`).
All styling is in `styles.css`. No build step.

## Adding your images

Every image spot shows a dashed box with a file name until you add that file to the `images/` folder.
Name your file to match and it appears automatically. JPG for photos, PNG for logos.
Export photos about 2000px wide so the site stays fast.

| File | Page | What goes there |
| --- | --- | --- |
| card-youth-era.jpg | Home | Unified logo or brand overview |
| (Photography card) | Home | Uses photo-hero.jpg from the Photography page |
| card-uplift.jpg | Home | Redesigned landing page |
| youth-era-hero.jpg | Youth Era | Wide shot of the brand in use |
| logos-before.png | Youth Era | Lineup of the old logos |
| before-post-1/2/3.jpg | Youth Era | Old location posts (already added; replace with your date-cropped versions, same names) |
| logo-unified.png | Youth Era | The unified logo |
| brand-sheet.jpg | Youth Era | Recreated brand overview |
| card-erazine.jpg | Youth Era | ERA'ZINE spread |
| card-renovation.jpg | Youth Era | Clackamas center, after |
| print-bilingual-front.jpg / print-bilingual-back.jpg | Print | Both sides of the bilingual brochure |
| print-brochure.webp / peer-support-brochure-cover.jpg | Print | Training brochure (outside and inside) and its cover for phones |
| print-flyer.webp | Print | Drop-in center flyer |
| print-sticker-1.jpg | Print | Stickers |
| erazine/cover.jpg | ERA'ZINE | The cover, as a single page (put it in the `images/erazine` folder) |
| erazine/spread-1.jpg and spread-2.jpg | ERA'ZINE | Each two-page spread as one wide image |
| reno-hero.jpg | Renovation | Wide shot of the finished center |
| reno-before-1 to reno-before-3.jpg | Renovation | Before photos |
| reno-after-1 to reno-after-3.jpg | Renovation | After photos matching each before (same angle if possible) |
| reno-after-4 to reno-after-6.jpg | Renovation | More after photos (tall) |
| nulia-01 to nulia-03.jpg | All Work | Nulia title card stills (already added) |
| film-01 to film-03.jpg | All Work | Production design set photos (wide). The Production Design section stays hidden until at least one is added |
| photo-hero.jpg | Photography | Wide group shot |
| photo-before.jpg | Photography | An old brand photo |
| photo-01 to photo-05.jpg | Photography | Brand photos (01–03 tall, 04–05 wide) |
| apparel-01 to apparel-03.jpg | Photography | Apparel product photos (tall) |
| brochure-before.jpg / brochure-after.jpg | Photography | Brochure before and after |
| uplift-before.jpg / uplift-after.jpg | Uplift | Landing page screenshots |
| deck-01 to deck-03.jpg | Uplift | Pitch deck slides (16:9) |

## ERA'ZINE page viewer

The viewer shows the cover as one page, then each spread as two pages side by side.
Export the cover as one image and each spread as one wide image (both facing pages together), named as in the table above.
It's sized for letter-size pages (8.5 x 11 in). If yours are a different size, tell Claude and the viewer can be adjusted.

## Publishing on GitHub Pages (free)

1. Create a free account at github.com and click **New repository**. Name it anything (for example `portfolio`), set it to **Public**, and create it.
2. On the new repository page, click **uploading an existing file**, drag in everything from this folder (including the `images` folder), and click **Commit changes**.
3. Go to **Settings → Pages**. Under "Branch," choose `main` and `/ (root)`, then **Save**.
4. After a minute or two, the page shows your live link (`yourname.github.io/portfolio`).

To use madspreston.com, enter it under **Settings → Pages → Custom domain**, then follow GitHub's instructions to point your domain's DNS at GitHub. You only pay for the domain.

To update later: open the file on GitHub, click the pencil icon to edit text, or upload a new image with the same name to replace it.
