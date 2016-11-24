from __future__ import absolute_import

from mock import patch

from ..get_documents import get_plotting_data

@patch('domain_discovery_tool.elastic.config.es.search')
def test_get_plotting_data(mock_es_search):
    mock_es_search.return_value = {
        u'_shards': {u'failed': 0, u'successful': 5, u'total': 5},
                     u'hits': {u'hits': [{u'_id': u'http://www.politico.com/story/2016/04/apple-hires-cynthia-hogan-221937',
                                          u'_index': u'apple',
                                          u'_score': 1.0,
                                          u'_type': u'page',
                                          u'fields': {u'query': [u'apple'],
                                           u'retrieved': [u'2016-04-16T00:06:35.292'],
                                           u'tag': [u'Relevant'],
                                           u'url': [u'http://www.politico.com/story/2016/04/apple-hires-cynthia-hogan-221937']}},
                                         {u'_id': u'http://www.applevacations.com/',
                                          u'_index': u'apple',
                                          u'_score': 1.0,
                                          u'_type': u'page',
                                          u'fields': {u'query': [u'apple'],
                                           u'retrieved': [u'2016-04-16T00:06:36.135'],
                                           u'tag': [u'Irrelevant', u'Relevant'],
                                           u'url': [u'http://www.applevacations.com/']}},
                                         {u'_id': u'http://www.reuters.com/article/us-apple-encryption-hearing-idUSKCN0XB2RU',
                                          u'_index': u'apple',
                                          u'_score': 1.0,
                                          u'_type': u'page',
                                          u'fields': {u'query': [u'apple'],
                                           u'retrieved': [u'2016-04-16T00:06:34.806'],
                                           u'url': [u'http://www.reuters.com/article/us-apple-encryption-hearing-idUSKCN0XB2RU']}}],
                               u'max_score': 1.0,
                               u'total': 285},
                     u'timed_out': False,
                     u'took': 9}

    result = [
        {u'query': [u'apple'],
         u'retrieved': [u'2016-04-16T00:06:35.292'],
         u'tag': [u'Relevant'],
         u'url': [u'http://www.politico.com/story/2016/04/apple-hires-cynthia-hogan-221937']},
        {u'query': [u'apple'],
         u'retrieved': [u'2016-04-16T00:06:36.135'],
         u'tag': [u'Irrelevant', u'Relevant'],
         u'url': [u'http://www.applevacations.com/']},
        {u'query': [u'apple'],
         u'retrieved': [u'2016-04-16T00:06:34.806'],
         u'url': [u'http://www.reuters.com/article/us-apple-encryption-hearing-idUSKCN0XB2RU']}
    ]

    assert get_plotting_data(u'potatoes', es=None) == result
