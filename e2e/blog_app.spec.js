const { test, expect, describe, beforeEach } = require('@playwright/test');
const { loginWith, addBlog, threeBlogs, addLikes } = require('./helpers');

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset');
        await request.post('/api/users', {
            data: {
                username: 'root',
                name: 'superuser',
                password: 'root'
            }
        });

        await page.goto('/');
    });

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('github repository')).toBeVisible();
        await expect(page.getByText('full stack open course')).toBeVisible();
        await expect(page.getByText('login')).toBeVisible();
    });

    describe('Login', () => {
        test('With correct credentials', async ({ page }) => {
            await loginWith(page, 'root', 'root');
            await expect(page.getByText('welcome, superuser')).toBeVisible();
        });

        test('And log out', async ({ page }) => {
            await loginWith(page, 'root', 'root');
            await page.getByRole('button', { name: 'logout' }).click();

            await expect(page.getByText('you are successfully logged out')).toBeVisible();
            await expect(page.getByText('login')).toBeVisible();
        });

        test('With wrong credentials', async ({ page }) => {
            await loginWith(page, 'root', 'wrongpassword');

            await expect(page.getByText('invalid username or password')).toBeVisible();
        });
    });

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'root', 'root');
        });

        test('Can see blog form', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click();
            await expect(page.getByRole('button', { name: 'add' })).toBeVisible();
            await expect(page.getByRole('button', { name: 'cancel' })).toBeVisible();
        });

        test('A new blog can be created', async ({ page }) => {
            await addBlog(page, 'First blog', 'Me', 'https://example.com');
            await expect(page.getByText('First blog - Me')).toBeVisible();
        });

        describe('With three blogs', () => {
            beforeEach(async ({ page }) => {
                for (const blog of threeBlogs) {
                    await addBlog(page, blog.title, blog.author, blog.url);
                }
            });

            test('Add a like to second blog', async ({ page }) => {
                const blog = await page.getByText(`${threeBlogs[1].title} - ${threeBlogs[1].author}`);
                await blog.click();
                await page.getByTestId('like').click();

                const likes = page.getByText(/1 likes/);
                await expect(likes).toBeVisible();
            });

            test('Add five likes to third blog', async ({ page }) => {
                await addLikes(page, threeBlogs[2], 5);
                await expect(page.getByText('5 likes')).toBeVisible();
            });

            test('Remove a blog', async ({ page }) => {
                const blog = await page.getByText(`${threeBlogs[0].title} - ${threeBlogs[0].author}`);
                await blog.click();
                await expect(page.getByRole('button', { name: 'remove' })).toBeVisible();

                await page.getByRole('button', { name: 'remove' }).click();
    
                page.on('dialog', dialog => dialog.accept());
                await expect(page.getByText(`${threeBlogs[0]} - ${threeBlogs[0]}`)).not.toBeVisible();
            });

            test('Check if there is no remove button for other user', async ({ page, request }) => {
                await request.post('/api/users', {
                    data: {
                        username: 'tester',
                        name: 'tester',
                        password: 'tester'
                    }
                });
                
                await page.getByRole('button', { name: 'logout' }).click();
                await loginWith(page, 'tester', 'tester');
                
                const blog = await page.getByText(`${threeBlogs[0].title} - ${threeBlogs[0].author}`);
                await blog.click();

                await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible();
            });

            test('Sorted in right order', async ({ page }) => {
                await addLikes(page, threeBlogs[0], 2);
                await page.goto('/');
                await addLikes(page, threeBlogs[1], 3);
                await page.goto('/');
                await addLikes(page, threeBlogs[2], 1);
                await page.goto('/');

                const sortedBlogs = [
                    threeBlogs[1], threeBlogs[0], threeBlogs[2]
                ]

                const blogs = await page.getByTestId('blog');
                let idx = 0;
                for (const blog of await blogs.all()) {
                    await expect(blog.getByText(`${sortedBlogs[idx].title} - ${sortedBlogs[idx].author}`)).toBeVisible();
                    ++idx;
                }
            });
        });
        

    });
});