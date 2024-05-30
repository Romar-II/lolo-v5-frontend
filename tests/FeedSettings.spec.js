import {mount} from '@vue/test-utils';
import FeedSettings from '@/views/FeedSettings.vue'
import AddSourceModal from '@/components/AddSourceModal.vue';
import EditFeedModal from '@/components/EditFeedModal.vue';
import DeleteFeedModal from '@/components/DeleteFeedModal.vue';
import {describe, it, expect, beforeEach, vi} from 'vitest';

describe('FeedSettings.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(FeedSettings, {
            components: {AddSourceModal, EditFeedModal, DeleteFeedModal},
        });
    });

    it('loads feeds from localStorage on mount', () => {
        const storedFeeds = [
            {name: 'Feed 1', link: 'https://example.com/feed1.rss'},
            {name: 'Feed 2', link: 'https://example.com/feed2.rss'},
        ];
        localStorage.setItem('feeds', JSON.stringify(storedFeeds));

        wrapper.vm.loadFeeds();

        expect(wrapper.vm.feeds).toEqual(storedFeeds);
    });

    it('saves a new feed', async () => {
        const newFeed = {name: 'New Feed', link: 'https://example.com/newfeed.rss'};

        wrapper.vm.saveNewFeed(newFeed.name, newFeed.link);

        expect(wrapper.vm.feeds).toContainEqual(newFeed);
    });

    it('edits an existing feed', async () => {
        const editedFeed = {name: 'Edited Feed', link: 'https://example.com/editedfeed.rss'};
        wrapper.vm.feeds = [{name: 'Old Feed', link: 'https://example.com/oldfeed.rss'}];

        wrapper.vm.editFeed(0, editedFeed.name, editedFeed.link);

        expect(wrapper.vm.feeds[0]).toEqual(editedFeed);
    });

    it('deletes a feed', async () => {
        wrapper.vm.feeds = [
            {name: 'Feed 1', link: 'https://example.com/feed1.rss'},
            {name: 'Feed 2', link: 'https://example.com/feed2.rss'},
        ];

        wrapper.vm.deleteFeed(0);

        expect(wrapper.vm.feeds).toHaveLength(1);
        expect(wrapper.vm.feeds[0].name).toBe('Feed 2');
    });

});
