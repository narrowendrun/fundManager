DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'capitaloutstandingbalance') THEN
        DROP TABLE capitaloutstandingbalance;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cashflow_schedule') THEN
        DROP TABLE cashflow_schedule;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fee_schedule') THEN
        DROP TABLE fee_schedule;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'costofcapital') THEN
        DROP TABLE costofcapital;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'capitaldeploymentschedule') THEN
        DELETE FROM capitaldeploymentschedule;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'capitalreturnschedule') THEN
        DELETE FROM capitalreturnschedule;
    END IF;
END $$;
