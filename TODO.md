# TODO: Add Photo Upload to News Submission and Display

## Backend Changes
- [x] Install multer in backend for file upload handling
- [x] Add image upload endpoint in backend/routes/news.js
- [x] Update backend/routes/news.js to handle image URLs in news submission

## Frontend Changes
- [x] Update src/types/index.ts to change imageUrl to images array
- [x] Add photo upload section in SubmitNews.tsx (similar to audio upload)
- [x] Update NewsDetail.tsx to display images in the article
- [x] Update src/services/api.js to add upload method for images

## Testing and Validation
- [ ] Test image upload functionality
- [ ] Handle image validation (size, type)
- [ ] Add image compression if needed
- [ ] Update any other components that display news previews
