import * as React from 'react';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { indigo } from '@material-ui/core/colors';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

export const TotalProfit = () => {

  return (
    <>
      <Card
        style={{ height: '100%' }}
      >
        <CardContent>
          <Grid
            container
            spacing={3}
            style={{ justifyContent: 'space-between' }}
          >
            <Grid item>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="h6"
              >
                TOTAL PROFIT
              </Typography>
              <Typography
                color="textPrimary"
                variant="h3"
              >
                $23,200
              </Typography>
            </Grid>
            <Grid item>
              <Avatar
                style={{
                  backgroundColor: indigo[600],
                  height: 56,
                  width: 56
                }}
              >
                <AttachMoneyIcon />
              </Avatar>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
};

export default TotalProfit;