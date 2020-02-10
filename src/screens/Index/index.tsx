import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import styled from 'styled-components';
import {
  Typography,
  Layout as AntdLayout,
  Menu,
  Icon,
  Card,
} from 'antd';

import * as ROUTES from '@constants/routes';
import { upperSnakeCaseToKebabCase } from '@services/string';
import { UnlockedCourse } from '@generated/client';
import { GET_UNLOCKED_COURSES } from '@queries/course';
import { Session } from '@typeDefs/session';
import Layout from '@components/Layout';

const { Content, Sider } = AntdLayout;

const StyledContent = styled(Content)`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 56px;
`;

const StyledCard = styled(Card)`
  min-width: 200px;
  max-width: 400px;
`;

interface DashboardPageProps {
  data: {
    unlockedCourses: UnlockedCourse[];
  };
}

type ExtendedNextPage = NextPage<DashboardPageProps>;

const DashboardPage: ExtendedNextPage = ({ data }) => {
  console.log(data);

  const isNoCourses = data.unlockedCourses.length;

  return (
    <Layout>
      <StyledContent>
        {data.unlockedCourses.map(course => (
          <StyledCard key={course.courseId}>
            <Link
              href={ROUTES.UNLOCKED_COURSE_DETAILS}
              as={`/p/${upperSnakeCaseToKebabCase(course.courseId)}`}
            >
              <a>{course.courseId}</a>
            </Link>
          </StyledCard>
        ))}
      </StyledContent>
    </Layout>
  );
};

DashboardPage.getInitialProps = async ctx => {
  const isServer = ctx.req || ctx.res;

  const context = isServer
    ? {
        context: {
          headers: {
            cookie: ctx?.req?.headers.cookie,
          },
        },
      }
    : null;

  const { data } = await ctx.apolloClient.query({
    fetchPolicy: 'network-only',
    query: GET_UNLOCKED_COURSES,
    ...(isServer && context),
  });

  return { data };
};

export default DashboardPage;
