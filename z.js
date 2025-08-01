const generatedFilename = (userId, allPostLength) => {
  const date = new Date().toDateString().replace(/:/g, "_");
  return `${userId}-${allPostLength}-${date}`;
};

const post = [{}, {}];
 const name1=generatedFilename("2345gt54er",post.length);
 const name=generatedFilename("2345gt54er",post.length);
 post.push({name:name})
 console.log(name);
 console.log(post);
 
 
