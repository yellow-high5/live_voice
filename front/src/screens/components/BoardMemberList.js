import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Badge from '@material-ui/core/Badge';
import { AccountCircle } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";


const inner_theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00FF02"
    },
    secondary: {
      main: "#FCEE21"
    }
  },
  overrides: {
    MuiTypography: {
      root: {
        color: "#FFFFFF!important",
      }
    },
    MuiBadge: {
      badge: {
      }
    }
  }
});

export const BoardMemberList = ({classes, members}) => {
  return(
    <MuiThemeProvider theme={inner_theme}>
      <Paper className={classes.paper_list}>
        <List component="div">
          { members.map((member, index) => {
            let name = (member.name === "") ? "Anonymous🤡" : member.name
            //パフォーマー
            if(index === 0){
              return(
                <ListItem className={classes.paper_list_item}>
                  <Badge color="primary" variant="dot">
                    <AccountCircle className={classes.topbar_icon} />
                  </Badge>
                  <Typography className={classes.paper_list_typo}>{name}</Typography>
                </ListItem>
              )
            }
            return(
              <ListItem className={classes.paper_list_item}>
                <Badge color="secondary" variant="dot">
                  <AccountCircle className={classes.topbar_icon} />
                </Badge>
                <Typography className={classes.paper_list_typo}>{name}</Typography>
              </ListItem>
            )
          })}
        </List>
      </Paper>
    </MuiThemeProvider>
  );
};


// {members.map((member) => (
//         let anonymous = 0:
//         if(member.name = ""){
//           anonymous++;
//         }
//         else{
//           <div className={classes.paper_list_item}>member.name</div>
//         }
//       ))}
