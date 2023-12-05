import { Box, Typography } from "@mui/material";

interface UserAccessLevelProps {
  accessLevel: number;
}

const GreetingMessage = ({ accessLevel }: UserAccessLevelProps) => {
  return (
    <Box
      sx={{
        mx: "10%",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {accessLevel <= 1 ? (
        <Typography variant="body1" align="center" gutterBottom>
          As a user below management capabilities, you can view a list of
          employees, manage jobs, and adjust your profile information.
        </Typography>
      ) : (
        <>
          <Typography variant="body1" gutterBottom>
            👋 Hello there! Welcome to ShiftScribe, your comprehensive tool for
            effortless time tracking and employee management. Here&apos;s a
            quick overview of what you can do with ShiftScribe:
          </Typography>
          <Typography variant="body1" gutterBottom>
            1. <strong>Track Time Seamlessly</strong>: With ShiftScribe,
            tracking time is a breeze. Your employees can log their hours
            directly from their personal devices using the ShiftScribe mobile
            app. As an admin, you get a clear view of everyone&apos;s time logs
            in one convenient place.
          </Typography>
          <Typography variant="body1" gutterBottom>
            2. <strong>Manage Employee Requests</strong>: Employees may
            occasionally miss logging their time. No worries! They can send
            requests for these times, and you can easily approve or deny these
            requests right from here.
          </Typography>
          <Typography variant="body1" gutterBottom>
            3. <strong>Employee Directory at Your Fingertips</strong>: View all
            the employees registered in your company. Need to make changes? You
            can add, remove, or edit employee details effortlessly, keeping your
            team&aposs info up-to-date.
          </Typography>
          <Typography variant="body1" gutterBottom>
            4. <strong>Job Management Made Easy</strong>: Whether it&apos;s a
            new project or an ongoing task, add and manage jobs with ease. Edit
            or remove them as your projects evolve. This feature keeps you
            organized and in control of every job at hand.
          </Typography>
          <Typography variant="body1" gutterBottom>
            5. <strong>Data Reporting & Storage</strong>: Generate CSV files to
            get a tangible view of the logged data. You can also view and
            securely store individualized CSV files, making it simple to track
            and analyze work hours over any given period.
          </Typography>
          <Typography variant="body1">
            ShiftScribe is here to make your administrative tasks simpler and
            more efficient. Dive into your dashboard and explore the many ways
            we can help you streamline your workflow!
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            If you need any assistance or have questions, feel free to reach
            out. We&apos;re here to help you make the most of ShiftScribe!
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Happy Managing! 🌟
          </Typography>
        </>
      )}
    </Box>
  );
};

export default GreetingMessage;
