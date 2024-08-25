// CategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";

const CategoryPage = () => {
  const { category } = useParams();
  const [filteredNotes, setFilteredNotes] = useState([]);
  const listings = useSelector((state) => state.listings);

  useEffect(() => {
    const filterNotes = listings.data.filter((listing) => {
      return listing.noteType === category.replace("%20", " ");
    });
    setFilteredNotes(filterNotes);
  }, [category, listings.data]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Notes for {category.replace("%20", " ")}
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {filteredNotes.map((note) => (
          <Grid item xs={12} sm={6} md={4} key={note._id}>
            <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {note.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {note.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  href={`/notes/${note._id}`}
                >
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoryPage;
