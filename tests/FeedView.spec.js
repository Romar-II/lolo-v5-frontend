import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import FeedView from '@/views/FeedView.vue';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

vi.mock('axios');

describe('FeedView.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(FeedView, {
      data() {
        return {
          feeds: [
            { link: 'http://example.com/feed1' },
            { link: 'http://example.com/feed2' },
          ],
        };
      },
    });
  });

  it('renders correctly with initial data', () => {
    expect(wrapper.find('.filter-container').exists()).toBe(true);
    expect(wrapper.find('select').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('send to Mercury');
  });

  it('filters news by selected category', async () => {
    wrapper.setData({
      contents: [
        {
          feedTitle: 'Feed 1',
          news: [
            {
              title: 'News 1',
              categories: ['Category 1'],
              guid: '1',
              link: 'http://example.com',
              pubDate: new Date().toISOString(),
              description: 'Description 1',
              author: 'Author 1',
              imageUrl: 'http://example.com/image.jpg',
            },
            {
              title: 'News 2',
              categories: ['Category 2'],
              guid: '2',
              link: 'http://example.com',
              pubDate: new Date().toISOString(),
              description: 'Description 2',
              author: 'Author 2',
              imageUrl: 'http://example.com/image2.jpg',
            },
          ],
        },
      ],
      availableCategories: ['Category 1', 'Category 2'],
      selectedCategory: 'Category 1',
    });

    await wrapper.vm.filterNewsByCategories();

    const expectedContents = [
      {
        feedTitle: 'Feed 1',
        news: [
          {
            title: 'News 1',
            categories: ['Category 1'],
            guid: '1',
            link: 'http://example.com',
            pubDate: wrapper.vm.filteredContents[0].news[0].pubDate, // use the actual pubDate
            description: 'Description 1',
            author: 'Author 1',
            imageUrl: 'http://example.com/image.jpg',
          },
        ],
      },
    ];

    const filteredContents = wrapper.vm.filteredContents.map(content => ({
      ...content,
      news: content.news.map(newsItem => omit(newsItem, 'pubDate')),
    }));

    expect(filteredContents).toEqual(expectedContents.map(content => ({
      ...content,
      news: content.news.map(newsItem => omit(newsItem, 'pubDate')),
    })));
  });

  it('calls getFeeds on beforeMount', async () => {
    const getFeedsSpy = vi.spyOn(FeedView.methods, 'getFeeds');

    // Remount the component to trigger the lifecycle hook
    wrapper = mount(FeedView, {
      data() {
        return {
          feeds: [
            { link: 'http://example.com/feed1' },
            { link: 'http://example.com/feed2' },
          ],
        };
      },
    });

    await wrapper.vm.$nextTick();
    expect(getFeedsSpy).toHaveBeenCalled();
  });

  it('renders news items correctly', async () => {
    wrapper.setData({
      filteredContents: [
        {
          feedTitle: 'Feed 1',
          news: [
            {
              title: 'News 1',
              categories: ['Category 1'],
              guid: '1',
              link: 'http://example.com',
              pubDate: new Date().toISOString(),
              description: 'Description 1',
              author: 'Author 1',
              imageUrl: 'http://example.com/image.jpg',
            },
          ],
        },
      ],
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('.news-item').length).toBe(1);
    expect(wrapper.find('.news-item').text()).toContain('News 1');
  });
});
