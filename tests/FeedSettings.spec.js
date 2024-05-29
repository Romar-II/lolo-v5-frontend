import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import FeedSettings from '@/views/FeedSettings.vue';
import AddSourceModal from '@/components/AddSourceModal.vue';
import EditFeedModal from '@/components/EditFeedModal.vue';
import DeleteFeedModal from '@/components/DeleteFeedModal.vue';

describe('FeedSettings.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(FeedSettings, {
            data() {
                return {
                    feeds: [
                        { name: 'Initial content', link: 'https://example.com/feed1.rss' },
                        { name: 'Test Feed', link: 'https://example.com/feed2.rss' },
                    ],
                };
            },
            global: {
                components: {
                    AddSourceModal,
                    EditFeedModal,
                    DeleteFeedModal,
                },
            },
        });
    });

    it('renders correctly with initial data', () => {
        expect(wrapper.find('.add-button').text()).toBe('Add Feeds');
        expect(wrapper.findAll('tbody tr').length).toBe(2);
    });

    it('opens AddSourceModal on add button click', async () => {
        const openModalSpy = vi.spyOn(wrapper.vm.$refs.addSourceModalRef.$refs.modalRef, 'openModal');
        await wrapper.find('.add-button').trigger('click');
        expect(openModalSpy).toHaveBeenCalled();
    });

    it('opens EditFeedModal on edit button click', async () => {
        const openModalSpy = vi.spyOn(wrapper.vm.$refs.editFeedModalRef.$refs.modalRef, 'openModal');
        await wrapper.findAll('.action-button').at(0).trigger('click');
        expect(openModalSpy).toHaveBeenCalled();
    });

    it('opens DeleteFeedModal on delete button click', async () => {
        const openModalSpy = vi.spyOn(wrapper.vm.$refs.deleteFeedModalRef.$refs.modalRef, 'openModal');
        await wrapper.findAll('.action-button').at(1).trigger('click');
        expect(openModalSpy).toHaveBeenCalled();
    });

    it('saves new feed correctly', async () => {
        const newFeed = { name: 'New Feed', link: 'https://example.com/newfeed.rss' };
        wrapper.vm.saveNewFeed(newFeed.name, newFeed.link);
        expect(wrapper.vm.feeds).toContainEqual(newFeed);
    });

    it('edits feed correctly', async () => {
        const editedFeed = { name: 'Edited Feed', link: 'https://example.com/editedfeed.rss' };
        wrapper.vm.editFeed(1, editedFeed.name, editedFeed.link);
        expect(wrapper.vm.feeds[1]).toEqual(editedFeed);
    });

    it('deletes feed correctly', async () => {
        wrapper.vm.deleteFeed(1);
        expect(wrapper.vm.feeds.length).toBe(1);
        expect(wrapper.vm.feeds[0].name).toBe('Initial content');
    });

    it('loads feeds from localStorage on mount', async () => {
        const feeds = [
            { name: 'Stored Feed 1', link: 'https://example.com/feed1.rss' },
            { name: 'Stored Feed 2', link: 'https://example.com/feed2.rss' },
        ];
        localStorage.setItem('feeds', JSON.stringify(feeds));
        wrapper.vm.loadFeeds();
        expect(wrapper.vm.feeds).toEqual(feeds);
    });
});
