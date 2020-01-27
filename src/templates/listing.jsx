import './listing.css';
import config from '../../data/SiteConfig';
import Helmet from 'react-helmet';
import Layout from '../layout';
import PostListing from '../components/PostListing/PostListing';
import SEO from '../components/SEO/SEO';
import React from 'react';
import { graphql, Link } from 'gatsby';

class Listing extends React.Component {
	render() {
		return (
			<Layout>
				<div className="listing-container">
					{this.renderPostsContainer()}
					{this.renderPaging()}
				</div>
			</Layout>
		);
	}

	renderPostsContainer() {
		return (
			<div className="posts-container">
				{this.renderHelmet()}
				<SEO />
				{this.renderPostListing()}
			</div>
		);
	}

	renderHelmet() {
		return <Helmet title={config.siteTitle} />;
	}

	renderPostListing() {
		const postEdges = this.props.data.allMarkdownRemark.edges;

		return <PostListing postEdges={postEdges} />;
	}

	renderPaging() {
		const { currentPageNum, pageCount } = this.props.pageContext;
		const prevPage =
			currentPageNum - 1 === 1 ? '/' : `/${currentPageNum - 1}/`;
		const nextPage = `/${currentPageNum + 1}/`;
		const isFirstPage = currentPageNum === 1;
		const isLastPage = currentPageNum === pageCount;

		return (
			<div className="paging-container">
				{this.renderPreviousLink(isFirstPage, prevPage)}
				{this.renderLinkList()}
				{this.renderNextLink(isLastPage, nextPage)}
			</div>
		);
	}

	renderPreviousLink(isFirstPage, prevPage) {
		let dataToRender = null;

		if (!isFirstPage) {
			dataToRender = <Link to={prevPage}>Previous</Link>;
		}

		return dataToRender;
	}

	renderLinkList() {
		const { pageCount } = this.props.pageContext;

		return [...Array(pageCount)].map((_val, index) => {
			const pageNum = index + 1;
			return <Link {...this.getLinkProps(pageNum)}>{pageNum}</Link>;
		});
	}

	renderNextLink(isLastPage, nextPage) {
		let dataToRender = null;

		if (!isLastPage) {
			dataToRender = <Link to={nextPage}>Next</Link>;
		}

		return dataToRender;
	}

	getLinkProps(pageNum) {
		let charToRender = pageNum === 1 ? '/' : `/${pageNum}/`;

		return {
			key: `listing-page-${pageNum}`,
			to: charToRender
		};
	}
}

export default Listing;

/* eslint no-undef: "off" */
export const listingQuery = graphql`
	query ListingQuery($skip: Int!, $limit: Int!) {
		allMarkdownRemark(
			sort: { fields: [fields___date], order: DESC }
			limit: $limit
			skip: $skip
		) {
			edges {
				node {
					fields {
						slug
						date
					}
					excerpt
					timeToRead
					frontmatter {
						title
						tags
						cover
						date
					}
				}
			}
		}
	}
`;
