const loginWith = async (page, username, password) => {
    await page.getByTestId('username').fill(username);
    await page.getByTestId('password').fill(password);
    await page.getByRole('button', { name: 'login' }).click();
};

const addBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click();
    await page.getByPlaceholder('title').fill(title);
    await page.getByPlaceholder('author').fill(author);
    await page.getByPlaceholder('url').fill(url);
    await page.getByRole('button', { name: 'add' }).click();
    await page.getByText(`${title} - ${author}`).waitFor();
};

const addLikes = async (page, blog, likes) => {
    const closedBlog = await page.getByText(`${blog.title} - ${blog.author}`);
    await closedBlog.click();

    for (let i = 0; i < likes; ++i) {
        await page.getByTestId('like').click();
        await page.waitForTimeout(500);
    }
};

const threeBlogs = [
    {
        title: 'First blog',
        author: 'First author',
        url: 'https://first.com'
    },
    {
        title: 'Second blog',
        author: 'Second author',
        url: 'https://second.com'
    },
    {
        title: 'Third blog',
        author: 'Third author',
        url: 'https://third.com'
    }
];

export { loginWith, addBlog, threeBlogs, addLikes }