# Publish on GitHub Pages

1. Create an empty GitHub repository, then upload this project's files to its `main` branch.
2. In the repository, open **Settings** → **Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Push to `main`. The included workflow builds the site and deploys it automatically.
5. When the workflow completes, return to **Settings** → **Pages** to find the live URL.

## Use your own domain

1. In **Settings** → **Pages**, enter your domain in **Custom domain**, then save it.
2. In your domain provider's DNS settings, add the record GitHub shows. For a subdomain, this is usually a `CNAME` pointing to `<your-github-username>.github.io`.
3. Wait for GitHub to verify DNS, then enable **Enforce HTTPS**.

The site uses only browser-side HTML, CSS, JavaScript, and local images. Product picks remain on the visitor's device until a form endpoint, such as Google Apps Script, is added.
