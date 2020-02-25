import React, { FunctionComponent, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  }
});

interface GameCardProps {
  title: string;
}

export const GameCard: FunctionComponent<GameCardProps> = ({ title }) => {
  const classes = useStyles();
  const history = useHistory();

  const onCardClick = useCallback(() => {
    history.push(`/play/${title}`);
  }, [title, history]);

  return (
    <Card className={classes.root} onClick={onCardClick}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image="/images/contemplative-reptile.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Game description is a brief overview that introduces the user to the
            experience they will recieve after launching the game
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
